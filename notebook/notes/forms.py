# forms.py

from django import forms
from .models import Note, Label

class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ['title', 'body', 'label', 'archived', 'pinned']
        widgets = {
            'label': forms.Select(),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)  # Get the user from kwargs
        super().__init__(*args, **kwargs)
        if user is not None:
            # Set the choices for the 'label' field based on the logged-in user
            self.fields['label'].queryset = Label.objects.filter(user=user)
            self.fields['label'].widget.choices = [(label.id, label.name) for label in self.fields['label'].queryset]


class LabelForm(forms.ModelForm):
    name = forms.EmailField(required=True,widget=forms.TextInput(attrs={'class': 'form-control', 'id': 'id_first_name'}))
    
    class Meta:
        model= Label
        fields= ['name']
