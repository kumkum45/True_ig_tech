import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from database import SessionLocal, Base, engine
from models import Trainer, Plan

# ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    t = Trainer(full_name='Demo Trainer', email='demo.trainer@example.com', password_hash='x')
    db.add(t)
    db.commit()
    db.refresh(t)
    p = Plan(title='Demo Plan', description='Test plan', price=9.99, duration='4 weeks', goal='lose fat', purchase_type='one-time', trainer_id=t.id)
    db.add(p)
    db.commit()
    db.refresh(p)
    print('Created trainer', t.id, 'plan', p.id)
finally:
    db.close()