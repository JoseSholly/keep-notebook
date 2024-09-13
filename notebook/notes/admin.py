from django.contrib import admin
from django.utils.html import format_html
from .models import Note, Label

class LabelInline(admin.TabularInline):
    model = Note.label.through
    extra = 1

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'get_labels', 'created', 'updated', 'is_trashed']
    search_fields = ['user__email', 'title', 'body']
    list_filter = ['label', 'pinned', 'created', 'updated', 'archived', 'trashed']
    actions = ['move_to_trash', 'restore_from_trash']
    filter_horizontal = ('label',)

    def get_labels(self, obj):
        return ", ".join([label.name for label in obj.label.all()])
    get_labels.short_description = 'Labels'

    def is_trashed(self, obj):
        return obj.trashed
    is_trashed.boolean = True
    is_trashed.short_description = 'Trashed'

    @admin.action(description='Trash selected notes')
    def move_to_trash(self, request, queryset):
        queryset.update(trashed=True)

    @admin.action(description='Restore selected notes')
    def restore_from_trash(self, request, queryset):
        queryset.update(trashed=False)

@admin.register(Label)
class LabelAdmin(admin.ModelAdmin):
    list_display = ['name', 'user','note_count',]
    search_fields = ['name', 'user__email']
    list_filter = ['user']
    inlines = [LabelInline]

    def note_count(self, obj):
        label_id = obj.id
        no_of_Notes= Note.objects.filter(label=label_id).count()
        return no_of_Notes
    note_count.short_description = 'Number of Notes'
