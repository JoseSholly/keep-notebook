from django.shortcuts import render, get_object_or_404
from .models import Note
# Create your views here.



def notes_list(request):
    pinned_notes= Note.objects.filter(pinned=True, archived= False)
    other_notes= Note.objects.filter(pinned=False, archived= False)
    # Note.objects.filter(Q(pinned=True,archived=False) | Q(pinned=False, archived=False)) 
    return render(request,
                  'notes/note/list.html',
                  {'pinned_notes': pinned_notes,
                   'other_notes': other_notes})


