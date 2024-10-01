from .common import *

SECRET_KEY= os.getenv("SECRET_KEY")

DEBUG = False

ALLOWED_HOSTS = ['127.0.0.1', ]

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(",")

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS= ['']


STATIC_ROOT= BASE_DIR/'staticfiles'
STORAGES = {
    # ... 
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}