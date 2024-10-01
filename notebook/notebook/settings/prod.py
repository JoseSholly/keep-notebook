from .common import *

SECRET_KEY= os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG")


database_url= os.getenv("DATABASE_URL")

DATABASES["default"] = dj_database_url.parse(database_url)


database_url= os.getenv("DATABASE_URL")
DATABASES["default"] = dj_database_url.parse(database_url)

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS")
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(",")

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS= ['https://keep-notebook.onrender.com']


STATIC_ROOT= BASE_DIR/'staticfiles'
STORAGES = {
    # ... 
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

SESSION_COOKIE_SECURE= True
CSRF_COOKIE_SECURE= True