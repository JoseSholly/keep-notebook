from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm
from notes.models import Note  

class NoteInline(admin.TabularInline):  # You can also use admin.StackedInline for a different layout
    model = Note
    extra = 0  # Number of empty forms to display
    fields = ['title', 'body', 'label', 'archived', 'pinned', 'created', 'updated']
    readonly_fields = ['created', 'updated']
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'first_name', 'last_name', 'is_staff']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    inlines = [NoteInline]  # Add this line to include the NoteInline

admin.site.register(CustomUser, CustomUserAdmin)
