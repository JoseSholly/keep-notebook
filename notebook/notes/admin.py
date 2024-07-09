from django.contrib import admin
from .models import Note
# Register your models here.

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display= ['id', 'title', 'body', 'archived', 'pinned', 'created', 'updated']
    search_fields= ['title', 'body', 'updated']
    list_filter = ['pinned', 'created', 'updated']