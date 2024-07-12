from django.shortcuts import render, get_object_or_404
from .models import Note
from django.db.models import Q
# Create your views here.



def notes_list(request):
    pinned_notes= Note.objects.filter(pinned=True, archived= False)
    other_notes= Note.objects.filter(pinned=False, archived= False)
    # Note.objects.filter(Q(pinned=True,archived=False) | Q(pinned=False, archived=False)) 
    return render(request,
                  'notes/note/list.html',
                  {'pinned_notes': pinned_notes,
                   'other_notes': other_notes})


def archived_list(request):
    archived_notes= Note.objects.filter(Q(pinned=True,archived=True) | Q(pinned=False, archived=True)) 
    context= { 'archived_notes':archived_notes,
              }

    return render(request,
                  'notes/archived/list.html',
                  context)