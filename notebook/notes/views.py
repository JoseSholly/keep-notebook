from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from .models import Note, Label
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.utils.dateformat import DateFormat
from datetime import *
import json
from django.contrib import messages
from .forms import NoteForm, LabelForm
from django.contrib.auth.decorators import login_required

# Create your views here.



@login_required
def notes_list(request):
    user = request.user
    form = NoteForm()
    pinned_notes = Note.objects.filter(user=user, pinned=True, archived=False)
    other_notes = Note.objects.filter(user=user, pinned=False, archived=False)
    labels = Label.objects.all()

    return render(request,
                  'notes/note/list.html',
                  {'pinned_notes': pinned_notes,
                   'other_notes': other_notes,
                   'labels': labels,
                   'form': form})

@login_required
def archived_list(request):
    user= request.user
    archived_notes= Note.objects.filter(Q(user=user, pinned=True,archived=True) | Q(user=user, pinned=False, archived=True)) 
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
@login_required
def note_detail(request, note_id):
    user= request.user
    note = get_object_or_404(Note, pk=note_id, user= user)
    if request.method == 'POST':
        data = json.loads(request.body)
        # print(data)
        note.title = data.get('title', note.title)
        note.body = data.get('body', note.body)

        # Handle the label
        label_id = data.get('label')
        if label_id:
            label = get_object_or_404(Label, pk=label_id)
            note.label = label
        else:
            note.label = None

        note.save()
        return JsonResponse({
            'status': 'success',
            'updated': format_updated_time(note.updated),  # Format updated time,
            'label': note.label.id if note.label else None
        })

    return JsonResponse({
        'id': note.id,
        'title': note.title,
        'body': note.body,
        'updated': format_updated_time(note.updated),  # Format updated time
        'label': note.label.id if note.label else None
    })

def note_create(request):
    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save()
            return redirect(reverse('notes:note_list'))
        else:
            messages.error(request, 'There was an error creating the note. Please check the form.')
    else:
        form = NoteForm()
    
    # Pass a context variable to indicate we're in the create view
    # return render(request, 'notes/note/create.html', {'form': form})
    return redirect('note_list')

def label_create(request):
    if request.method == 'POST':
        form = LabelForm(request.POST)
        if form.is_valid():
            label= form.save()

            return redirect(reverse('notes:label_list', args=[label.name]))
        else:
            messages.error(request, 'There was an error creating the Label. Please check the form.')
    else:
        form = LabelForm()
    return render(request, 'notes/label/form.html', {'form': form})