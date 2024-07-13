from django.urls import path
from . import views
app_name = 'notes'
urlpatterns = [
    path('', views.notes_list, name='note_list'),
    path('archived/', views.archived_list, name='archived_notes'),
    path('label/<str:label_name>/', views.label_list_view, name='label_list')
]