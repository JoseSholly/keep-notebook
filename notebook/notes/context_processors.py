from .models import Label, Note
from django.shortcuts import render, get_object_or_404


def labels_processor(request):
    labels = Label.objects.all()

    context = {
        'labels': labels,
    }
    return context