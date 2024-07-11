from django.shortcuts import render, get_object_or_404
from .models import Note
# Create your views here.



def notes_list(request):
    notes= Note.objects.all()
    return render(request,
                  'notes/note/list.html',
                  {'notes': notes})