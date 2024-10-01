from .common import *


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-u$_ntn=e-*eqzv1)rvtuo7+kmsg$$x&h3jr6tq$7i1t2m*o(m4'

DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

STATIC_ROOT= BASE_DIR/'staticfiles'

STATIC_URL = '/static/'