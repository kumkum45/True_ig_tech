import os
import sys
import bcrypt
import passlib.hash as ph
import traceback

# make project root importable when running this script directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

print('bcrypt module:', bcrypt)
print('has __about__:', hasattr(bcrypt, '__about__'))
print('bcrypt attrs sample:', [a for a in dir(bcrypt) if not a.startswith('_')][:40])
print('bcrypt_sha256 available in passlib:', hasattr(ph, 'bcrypt_sha256'))
from passlib.hash import bcrypt_sha256
print('hashing short password:')
print(bcrypt_sha256.hash('shortpw'))
print('hashing 100-char password:')
try:
    print(bcrypt_sha256.hash('p'*100))
except Exception:
    traceback.print_exc()