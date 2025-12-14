import os
import datetime
from passlib.hash import pbkdf2_sha256, bcrypt_sha256
import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", "60"))


def hash_password(password: str) -> str:
	# use PBKDF2-SHA256 which accepts arbitrarily long inputs and is
	# resistant to the bcrypt 72-byte limitation
	return pbkdf2_sha256.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
	# prefer pbkdf2_sha256; fall back to bcrypt_sha256 for older hashes
	try:
		if pbkdf2_sha256.verify(password, password_hash):
			return True
	except Exception:
		pass
	try:
		return bcrypt_sha256.verify(password, password_hash)
	except Exception:
		return False


def create_token(subject: int, role: str) -> str:
	now = datetime.datetime.utcnow()
	payload = {
		"sub": subject,
		"role": role,
		"iat": now,
		"exp": now + datetime.timedelta(minutes=JWT_EXP_MINUTES),
	}
	return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def decode_token(token: str):
	try:
		data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
		return data
	except Exception:
		return None
