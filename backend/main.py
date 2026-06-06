from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.routers.health import router as health_router

from app.middleware.error_handler import (
    generic_exception_handler,
    validation_exception_handler
)

app = FastAPI(
    title="Habit Tracker API",
    version="0.0.1" #initial version, can be updated as needed
)

origins = [
    "http://localhost:1420",
    "http://127.0.0.1:1420",
    "http://localhost:3000"
] #default frontend ports, can be adjusted as needed

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)

app.add_exception_handler(
    Exception,
    generic_exception_handler
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler
)