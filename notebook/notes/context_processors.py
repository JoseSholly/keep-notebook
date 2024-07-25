from .models import Label, Note
from .forms import NoteForm
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse

def labels_processor(request):
    labels = Label.objects.all()

    context = {
        'labels': labels,
    }
    return context
