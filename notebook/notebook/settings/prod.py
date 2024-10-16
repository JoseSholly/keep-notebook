from .common import *

SECRET_KEY= os.getenv("SECRET_KEY")

# DEBUG = os.getenv("DEBUG_VALUE", "False").lower() in ['true', '1']
DEBUG= False


database_url= os.getenv("DATABASE_URL")

DATABASES["default"] = dj_database_url.parse(database_url)


database_url= os.getenv("DATABASE_URL")

DATABASES["default"] = dj_database_url.parse(database_url)

ALLOWED_HOSTS = ['127.0.0.1',]

RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(",")

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS= ['https://keep-notebook.onrender.com', 'http://127.0.0.1:8001']

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(PROJECT_DIR,"accounts","static"),
    os.path.join(PROJECT_DIR,"notes","static"),
    # add other directories if needed
]

# This production code might break development mode, so we check # This production code might break development mode, so we check whether we're in DEBUG mode
if not DEBUG:
    # Tell Django to copy static assets into a path called `staticfiles` (this is specific to Render)
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    # Enable the WhiteNoise storage backend, which compresses static files to reduce disk use
    # and renames the files with unique names for each version to support long-term caching
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'
    WHITENOISE_AUTOREFRESH = True
    WHITENOISE_USE_FINDERS = True
    WHITENOISE_COMPRESS = True
    WHITENOISE_MANIFEST_STRICT = True 



SESSION_COOKIE_SECURE= True
CSRF_COOKIE_SECURE= True


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'debug.log',  # Change the path as needed
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
