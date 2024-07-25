# forms.py

from django import forms
from .models import Note, Label

class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ['title', 'body', 'label', 'archived', 'pinned']
        widgets = {
            'label': forms.Select(choices=[(label.id, label.name) for label in Label.objects.all()])
        }


class LabelForm(forms.ModelForm):
    class Meta:
        model= Label
        fields= ['name']
