# from django.contrib import admin
# from django.utils.html import format_html
# from .models import Note, Label

# @admin.register(Note)
# class NoteAdmin(admin.ModelAdmin):
#     list_display = ['id', 'user', 'title', 'label', 'created', 'updated', 'is_trashed']
#     search_fields = ['user', 'title', 'body', 'updated', 'archived', 'pinned']
#     list_filter = ['pinned', 'created', 'updated', 'archived', 'trashed']
#     actions = ['move_to_trash', 'restore_from_trash']

#     def is_trashed(self, obj):
#         return obj.trashed
#     is_trashed.boolean = True
#     is_trashed.short_description = 'Trashed'

#     @admin.action(description='Trash selected notes')
#     def move_to_trash(self, request, queryset):
#         queryset.update(trashed=True)

#     @admin.action(description='Restore selected notes')
#     def restore_from_trash(self, request, queryset):
#         queryset.update(trashed=False)

# class NoteInline(admin.TabularInline):
#     model = Note
#     extra = 0

# @admin.register(Label)
# class LabelAdmin(admin.ModelAdmin):
#     list_display = ['name']
#     search_fields = ['name']
#     inlines = [NoteInline]
