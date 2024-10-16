from django.urls import path
from . import views
app_name = 'notes'
urlpatterns = [
    path('', views.notes_list, name='note_list'),
    path('label/create/', views.label_create, name='label_create'),
    path('create/', views.note_create, name='note_create'),
    path('archived/', views.archived_list, name='archived_notes'),
    path('label/<str:label_name>/', views.label_list_view, name='label_list'),
    path('label/<int:label_id>/edit/', views.label_edit, name='label_edit'),
    path('label/<int:label_id>/delete/', views.label_delete, name='label_delete'),
    path('<int:note_id>/', views.note_detail, name='note_details'),
    path('<int:note_id>/toggle-archive/', views.toggle_archive_status, name='toggle_archive_status'),
    path('trash/', views.trash_list, name='note_trash'),
    path('<int:note_id>/move-to-trash/', views.move_to_trash, name="move_trash"),
    path('trash/<int:note_id>/', views.trash_note_detail, name='trash_note_detail'),
    path('<int:note_id>/restore-from-trash/', views.restore_from_trash, name="restore_note"),
    path('<int:note_id>/delete/', views.delete_note, name="delete_note"),
    path('<int:note_id>/pin-note/', views.toggle_pinned_status, name="toogle_pinned_status"), 
    
    
]