import os
import sys
# make project root importable when running this script directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from auth import hash_password, verify_password

long_pw = 'p' * 200
print('testing long password hashing...')
h = hash_password(long_pw)
print('hash ok:', h[:60] + '...')
print('verify long pw:', verify_password(long_pw, h))
print('verify wrong pw:', verify_password('wrong', h))

short_pw = 'shortpw'
h2 = hash_password(short_pw)
print('hash ok:', h2[:60] + '...')
print('verify short pw:', verify_password(short_pw, h2))
