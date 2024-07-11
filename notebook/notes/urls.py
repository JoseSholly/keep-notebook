from django.urls import path
from . import views
app_name = 'notes'
urlpatterns = [
    path('', views.notes_list, name='note_list'),
]