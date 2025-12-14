from database import engine, SessionLocal
from models import User, Trainer
from auth import hash_password


def create_demo():
    from sqlalchemy.orm import Session
    db = Session(bind=engine)

    if not db.query(User).filter_by(email="user@example.com").first():
        u = User(full_name="Demo User", email="user@example.com", password_hash=hash_password("password123"))
        db.add(u)

    if not db.query(Trainer).filter_by(email="trainer@example.com").first():
        t = Trainer(full_name="Demo Trainer", email="trainer@example.com", password_hash=hash_password("password123"))
        db.add(t)

    db.commit()
    print("Demo accounts created: user@example.com / trainer@example.com (password123)")


if __name__ == "__main__":
    create_demo()
