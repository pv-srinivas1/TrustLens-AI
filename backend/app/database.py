from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
        db_path = "/tmp/trustlens.db"
    else:
        db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "trustlens.db"))
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    try:
        from app.models import models
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print("init_db warning:", e)

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
