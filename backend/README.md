# Backend (Flask)

This backend provides signup and login endpoints using SQLAlchemy and JWT.

Setup

1. Create a `.env` file in `backend/` from `.env.example` and set `DATABASE_URL` and `SECRET_KEY`.
2. Install dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

3. Run the app (creates tables automatically):

```bash
python backend/app.py
```

4. Optionally create demo accounts:

```bash
python backend/create_demo.py
```

Endpoints

- `POST /api/signup/user` - create user
- `POST /api/signup/trainer` - create trainer
- `POST /api/login/user` - login user (returns token, role, id)
- `POST /api/login/trainer` - login trainer (returns token, role, id)
- `GET /api/me` - returns token payload (requires `Authorization: Bearer <token>`)
