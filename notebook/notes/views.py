from django.shortcuts import render, get_object_or_404
from .models import Note, Label
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.utils.dateformat import DateFormat
from datetime import *
import json
# Create your views here.



def notes_list(request):
    pinned_notes= Note.objects.filter(pinned=True, archived= False)
    other_notes= Note.objects.filter(pinned=False, archived= False)
    # Note.objects.filter(Q(pinned=True,archived=False) | Q(pinned=False, archived=False))
    labels= Label.objects.all()
    return render(request,
                  'notes/note/list.html',
                  {'pinned_notes': pinned_notes,
                   'other_notes': other_notes,
                   'labels': labels})


def archived_list(request):
    archived_notes= Note.objects.filter(Q(pinned=True,archived=True) | Q(pinned=False, archived=True)) 
    context= { 'archived_notes':archived_notes,
              }

    return render(request,
                  'notes/archived/list.html',
                  context)

def labels_list(request):
    labels = Label.objects.all()
    context = {
        'labels': labels,
    }
    return render(request, 'note/labels_context_list.html', context)

def label_list_view(request, label_name):
    label= get_object_or_404(Label, name=label_name)
    notes= Note.objects.filter(label=label)
    if notes:
        context = {
            'label_notes': notes,
            'label': label 
        }
        return render(request, 'notes/label/list.html', context)
    else:
        context = {
        
            'label': label 
        }
        
        return render(request, 'notes/label/empty.html', context)

    
def format_updated_time(updated):
    now = datetime.now()
    
    if updated.date() == now.date():
        return updated.strftime('Today %H:%M')
    elif updated.date() == (now - timedelta(days=1)).date():
        return updated.strftime('Yesterday %H:%M')
    elif updated.date().year == now.year:
        if (now.day - updated.day) <= 3:
            return updated.strftime('%B %d %H:%M')
        else:
            return updated.strftime('%B %d %H:%M')
    else:
        return updated.strftime('%B %d, %Y %H:%M')
    
def note_detail(request, note_id):
    note = get_object_or_404(Note, pk=note_id)
    if request.method == 'POST':
        data = json.loads(request.body)
        note.title = data.get('title', note.title)
        note.body = data.get('body', note.body)
        note.save()
        return JsonResponse({
            'status': 'success',
            'updated': format_updated_time(note.updated)  # Format updated time
        })

    return JsonResponse({
        'id': note.id,
        'title': note.title,
        'body': note.body,
        'updated': format_updated_time(note.updated),  # Format updated time
    })