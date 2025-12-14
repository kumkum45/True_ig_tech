from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
	__tablename__ = "users"
	id = Column(Integer, primary_key=True, index=True)
	full_name = Column(String(256), nullable=False)
	email = Column(String(256), unique=True, nullable=False, index=True)
	password_hash = Column(String(256), nullable=False)
	age = Column(Integer, nullable=True)
	gender = Column(String(50), nullable=True)
	height = Column(String(50), nullable=True)
	weight = Column(String(50), nullable=True)
	fitness_goal = Column(String(128), nullable=True)
	activity_level = Column(String(128), nullable=True)


class Trainer(Base):
	__tablename__ = "trainers"
	id = Column(Integer, primary_key=True, index=True)
	full_name = Column(String(256), nullable=False)
	email = Column(String(256), unique=True, nullable=False, index=True)
	password_hash = Column(String(256), nullable=False)
	years_experience = Column(Integer, nullable=True)
	certifications = Column(Text, nullable=True)
	specializations = Column(Text, nullable=True)
	bio = Column(Text, nullable=True)

	# relationships
	plans = relationship("Plan", back_populates="trainer", cascade="all, delete-orphan")
	followers = relationship(
		"Follower",
		foreign_keys="Follower.trainer_id",
		back_populates="trainer",
		cascade="all, delete-orphan",
	)

	def follower_count(self):
		return len(self.followers)


class Plan(Base):
	__tablename__ = "plans"
	id = Column(Integer, primary_key=True, index=True)
	title = Column(String(256), nullable=False)
	description = Column(Text, nullable=True)
	price = Column(Float, nullable=False, default=0.0)
	duration = Column(String(64), nullable=True)
	goal = Column(String(128), nullable=True)
	purchase_type = Column(String(64), nullable=True)
	active = Column(Boolean, default=True)
	created_at = Column(DateTime, default=datetime.utcnow)
	trainer_id = Column(Integer, ForeignKey("trainers.id"), nullable=False)
	trainer = relationship("Trainer", back_populates="plans")
	rating = Column(Float, default=0.0)

	# enrollments relationship
	enrollments = relationship("Enrollment", back_populates="plan", cascade="all, delete-orphan")

	def enrolled_count(self):
		return len(self.enrollments)


class Enrollment(Base):
	__tablename__ = "enrollments"
	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
	plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
	created_at = Column(DateTime, default=datetime.utcnow)

	plan = relationship("Plan", back_populates="enrollments")


class Follower(Base):
	__tablename__ = "followers"
	id = Column(Integer, primary_key=True, index=True)
	follower_id = Column(Integer, ForeignKey("users.id"), nullable=False)
	trainer_id = Column(Integer, ForeignKey("trainers.id"), nullable=False)
	created_at = Column(DateTime, default=datetime.utcnow)

	trainer = relationship("Trainer", back_populates="followers")
