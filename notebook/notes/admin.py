from django.contrib import admin
from .models import Note, Label
# Register your models here.

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display= ['id', 'user','title','label','created', 'updated']
    search_fields= ['user','title', 'body', 'updated', 'archived', 'pinned', ]
    list_filter = ['pinned', 'created', 'updated', 'archived']

class NoteInline(admin.TabularInline):
    model= Note
    extra=0

@admin.register(Label)
class LabelAdmin(admin.ModelAdmin):
    list_display = [ 'name']
    search_fields = ['name']
    inlines = [NoteInline]