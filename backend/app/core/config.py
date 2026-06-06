from pydantic_settings import BaseSettings


class Settings(BaseSettings): #application settings loaded from environment variables
    APP_NAME: str
    VERSION: str

    API_HOST: str
    API_PORT: int

    class Config:
        env_file = ".env" #load environment variables from .env file


settings = Settings()