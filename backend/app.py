import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base, SessionLocal
from models import User, Trainer
from auth import hash_password, verify_password, create_token, decode_token
from models import Plan, Enrollment, Follower

app = Flask(__name__)
CORS(app)

# Ensure tables exist when the app is imported (works with Flask CLI)
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "Trueig API",
        "endpoints": [
            "/api/signup/user",
            "/api/signup/trainer",
            "/api/login/user",
            "/api/login/trainer",
            "/api/me",
        ],
    })


@app.route("/api/signup/user", methods=["POST"])
def signup_user():
    data = request.json or {}
    db = next(get_db())
    if not data.get("password"):
        return jsonify({"error": "Password is required"}), 400
    # password length normalization is handled by the auth layer
    if db.query(User).filter_by(email=data.get("email")).first():
        return jsonify({"error": "Email already registered"}), 400

    user = User(
        full_name=data.get("full_name"),
        email=data.get("email"),
        password_hash=hash_password(data.get("password")),
        age=data.get("age"),
        gender=data.get("gender"),
        height=str(data.get("height")) if data.get("height") is not None else None,
        weight=str(data.get("weight")) if data.get("weight") is not None else None,
        fitness_goal=data.get("fitness_goal"),
        activity_level=data.get("activity_level"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return jsonify({"id": user.id, "email": user.email})


@app.route("/api/signup/trainer", methods=["POST"])
def signup_trainer():
    data = request.json or {}
    db = next(get_db())
    if not data.get("password"):
        return jsonify({"error": "Password is required"}), 400
    # password length normalization is handled by the auth layer
    if db.query(Trainer).filter_by(email=data.get("email")).first():
        return jsonify({"error": "Email already registered"}), 400

    trainer = Trainer(
        full_name=data.get("full_name"),
        email=data.get("email"),
        password_hash=hash_password(data.get("password")),
        years_experience=data.get("years_experience"),
        certifications=','.join(data.get("certifications") or []),
        specializations=','.join(data.get("specializations") or []),
        bio=data.get("bio"),
    )
    db.add(trainer)
    db.commit()
    db.refresh(trainer)
    return jsonify({"id": trainer.id, "email": trainer.email})


@app.route("/api/login/user", methods=["POST"])
def login_user():
    data = request.json or {}
    db = next(get_db())
    user = db.query(User).filter_by(email=data.get("email")).first()
    if not user or not verify_password(data.get("password"), user.password_hash):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_token(user.id, "user")
    return jsonify({"token": token, "role": "user", "id": user.id})


@app.route("/api/login/trainer", methods=["POST"])
def login_trainer():
    data = request.json or {}
    db = next(get_db())
    trainer = db.query(Trainer).filter_by(email=data.get("email")).first()
    if not trainer or not verify_password(data.get("password"), trainer.password_hash):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_token(trainer.id, "trainer")
    return jsonify({"token": token, "role": "trainer", "id": trainer.id})


@app.route("/api/me", methods=["GET"])
def me():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth.split(" ", 1)[1]
        payload = decode_token(token)
        if payload:
            return jsonify(payload)
    return jsonify({"error": "Unauthorized"}), 401


def get_payload_from_header():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth.split(" ", 1)[1]
        return decode_token(token)
    return None


def require_auth(role=None):
    def decorator():
        payload = get_payload_from_header()
        if not payload:
            return None, (jsonify({"error": "Unauthorized"}), 401)
        if role and payload.get("role") != role:
            return None, (jsonify({"error": "Forbidden"}), 403)
        return payload, None
    return decorator


@app.route("/plans", methods=["POST"])
def create_plan():
    payload, err = require_auth("trainer")()
    if err:
        return err
    data = request.json or {}
    db = next(get_db())
    trainer_id = payload.get("sub")
    title = data.get("title")
    if not title:
        return jsonify({"error": "Title is required"}), 400
    plan = Plan(
        title=title,
        description=data.get("description"),
        price=float(data.get("price") or 0.0),
        duration=data.get("duration"),
        goal=data.get("goal"),
        purchase_type=data.get("purchase_type"),
        trainer_id=trainer_id,
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return jsonify({"id": plan.id, "title": plan.title}), 201


@app.route("/plans/trainer", methods=["GET"])
def get_my_plans():
    payload, err = require_auth("trainer")()
    if err:
        return err
    trainer_id = payload.get("sub")
    db = next(get_db())
    plans = db.query(Plan).filter_by(trainer_id=trainer_id, active=True).all()
    result = []
    for p in plans:
        result.append({
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "duration": p.duration,
            "goal": p.goal,
            "rating": p.rating,
            "enrolled_count": p.enrolled_count(),
        })
    return jsonify(result)


@app.route("/plans/trainer/<int:trainer_id>", methods=["GET"])
def get_plans_for_trainer(trainer_id):
    db = next(get_db())
    plans = db.query(Plan).filter_by(trainer_id=trainer_id, active=True).all()
    result = []
    for p in plans:
        result.append({
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "duration": p.duration,
            "goal": p.goal,
            "rating": p.rating,
            "enrolled_count": p.enrolled_count(),
        })
    return jsonify(result)


@app.route("/plans/<int:plan_id>", methods=["PUT"])
def update_plan(plan_id):
    payload, err = require_auth("trainer")()
    if err:
        return err
    trainer_id = payload.get("sub")
    data = request.json or {}
    db = next(get_db())
    plan = db.query(Plan).filter_by(id=plan_id).first()
    if not plan:
        return jsonify({"error": "Not found"}), 404
    if plan.trainer_id != trainer_id:
        return jsonify({"error": "Forbidden"}), 403
    for k in ["title", "description", "price", "duration", "goal", "purchase_type", "active", "rating"]:
        if k in data:
            setattr(plan, k, data.get(k))
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return jsonify({"id": plan.id, "title": plan.title})


@app.route("/plans/<int:plan_id>", methods=["DELETE"])
def delete_plan(plan_id):
    payload, err = require_auth("trainer")()
    if err:
        return err
    trainer_id = payload.get("sub")
    db = next(get_db())
    plan = db.query(Plan).filter_by(id=plan_id).first()
    if not plan:
        return jsonify({"error": "Not found"}), 404
    if plan.trainer_id != trainer_id:
        return jsonify({"error": "Forbidden"}), 403
    db.delete(plan)
    db.commit()
    return jsonify({"status": "deleted"})


@app.route("/trainers/<int:trainer_id>/follow", methods=["POST"])
def follow_trainer(trainer_id):
    payload, err = require_auth("user")()
    if err:
        return err
    user_id = payload.get("sub")
    db = next(get_db())
    # check if trainer exists
    trainer = db.query(Trainer).filter_by(id=trainer_id).first()
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    # avoid duplicate follow
    if db.query(Follower).filter_by(follower_id=user_id, trainer_id=trainer_id).first():
        return jsonify({"status": "already_following"})
    f = Follower(follower_id=user_id, trainer_id=trainer_id)
    db.add(f)
    db.commit()
    return jsonify({"status": "followed"})


@app.route("/trainers/<int:trainer_id>/follow", methods=["DELETE"])
def unfollow_trainer(trainer_id):
    payload, err = require_auth("user")()
    if err:
        return err
    user_id = payload.get("sub")
    db = next(get_db())
    f = db.query(Follower).filter_by(follower_id=user_id, trainer_id=trainer_id).first()
    if not f:
        return jsonify({"status": "not_following"})
    db.delete(f)
    db.commit()
    return jsonify({"status": "unfollowed"})


@app.route("/trainers/<int:trainer_id>", methods=["GET"])
def get_trainer_profile(trainer_id):
    db = next(get_db())
    trainer = db.query(Trainer).filter_by(id=trainer_id).first()
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    follower_count = len(trainer.followers)
    # average rating across plans
    plans = db.query(Plan).filter_by(trainer_id=trainer_id).all()
    avg_rating = 0.0
    if plans:
        ratings = [p.rating or 0.0 for p in plans]
        avg_rating = sum(ratings) / len(ratings)
    payload = get_payload_from_header()
    is_following = False
    if payload and payload.get("role") == "user":
        uid = payload.get("sub")
        is_following = db.query(Follower).filter_by(follower_id=uid, trainer_id=trainer_id).first() is not None
    return jsonify({
        "id": trainer.id,
        "full_name": trainer.full_name,
        "email": trainer.email,
        "bio": trainer.bio,
        "specializations": trainer.specializations,
        "follower_count": follower_count,
        "avg_rating": avg_rating,
        "is_following": is_following,
    })


if __name__ == "__main__":
    # create tables on startup
    Base.metadata.create_all(bind=engine)
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
