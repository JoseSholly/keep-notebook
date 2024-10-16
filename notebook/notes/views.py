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
from django.views.decorators.http import require_POST
from django.utils import timezone

# Create your views here.



@login_required
def notes_list(request):
    user = request.user
    form = NoteForm()
    pinned_notes = Note.objects.filter(user=user, pinned=True, archived=False, trashed= False)
    other_notes = Note.objects.filter(user=user, pinned=False, archived=False,  trashed= False)
    return render(request,
                  'notes/note/list.html',
                  {'pinned_notes': pinned_notes,
                   'other_notes': other_notes,
                   'form': form})

@login_required
def archived_list(request):
    user= request.user
    archived_notes= Note.objects.filter(Q(user=user, pinned=True,archived=True, trashed= False) | Q(user=user, pinned=False, archived=True, trashed= False)) 
    context= { 'archived_notes':archived_notes,
              }

    return render(request,
                  'notes/archived/list.html',
                  context)

@login_required
def labels_list(request):
    user= request.user
    labels = Label.objects.filter(user=user)
    context = {
        'labels': labels,
    }
    return render(request, 'note/labels_context_list.html', context)

@login_required
def label_list_view(request, label_name):
    user= request.user
    label= get_object_or_404(Label, name=label_name, user= user)
    notes= Note.objects.filter(label=label, user= user,  trashed= False, archived=False)
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
    user = request.user
    note = get_object_or_404(Note, pk=note_id, user=user, trashed=False)
    all_labels = Label.objects.filter(user=request.user).values('id', 'name')
    all_labels = list(all_labels)

    if request.method == 'POST':
        data = json.loads(request.body)

        note.title = data.get('title', note.title)
        note.body = data.get('body', note.body)

        label_ids = data.get('label', [])

        if label_ids:
            # Handle multiple labels (if expected)
            # print(label_ids)
            labels = Label.objects.filter(pk__in=label_ids, user=user)
            note.label.set(labels)
        else:
            note.label.clear()  # Clear labels if no IDs provided

        note.save()
        messages.success(request, "Note updated.")
        return JsonResponse({
            'status': 'success',
            'updated': format_updated_time(note.updated),
            'label': list(note.label.values_list('id', flat=True)),
        })

    return JsonResponse({
        'id': note.id,
        'title': note.title,
        'body': note.body,
        'updated': format_updated_time(note.updated),
        'label': list(note.label.values('id', 'name')),
        'archived': note.archived,
        'pinned': note.pinned,
        'all_labels': all_labels,
        
    })
@login_required
def note_create(request):
    user = request.user
    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)  
            note.user = user
            note.save()  # Save the Note instance to the database
            messages.success(request, "Note created successfully")
            return redirect(reverse('notes:note_list'))
        else:
            messages.error(request, 'There was an error creating the note. Please check the form.')
    else:
        form = NoteForm()
    # return render(request, 'notes/note/create.html', {'form': form})
    return redirect(reverse('notes:note_list'))


@login_required
def label_create(request):
    user = request.user
    if request.method == 'POST':
        form = LabelForm(request.POST)
        if form.is_valid():
            
            label = form.save(commit=False)
            label.user = user
            label.save()
            messages.success(request, "Label was created successfully")
            return redirect(reverse('notes:label_list', args=[label.name]))
        else:
            messages.error(request, 'There was an error creating the Label. Please check the form.')
    else:
        form = LabelForm()
        
    return render(request, 'notes/label/form.html', {'form': form})


@login_required
def label_edit(request, label_id):
    
    user= request.user
    label= get_object_or_404(Label, id=label_id, user=user)

    if request.method=="POST":
        data= json.loads(request.body)
        new_label_name = data.get('label_name')

        if new_label_name:
            label.name = new_label_name
            label.save()
            messages.success(request, "Label updated succesfully")
            return JsonResponse({
                "success": True, 
                "message": "Label updated successfully.",
                "label": new_label_name})
    elif request.method=="GET":
        return JsonResponse({"label": label.name})

@login_required
def label_delete(request, label_id):
    user= request.user
    label= get_object_or_404(Label, id=label_id, user=user)

    if request.method == "DELETE":
        label.delete()
        messages.success(request, "Label deleted succesfully")
        return JsonResponse({
                "success": True, 
                "message": "Label deleted successfully.",
                })

@login_required
def toggle_archive_status(request, note_id):
    user = request.user
    note = get_object_or_404(Note,pk=note_id, user=user, trashed= False)
    if request.method== 'POST':
        # Toggle the archived status
        note.archived = not note.archived
        if note.archived==True:
            messages.success(request, "Note archived")
        else:
            messages.success(request, "Note unarchived")
        note.save()


    return JsonResponse({
        'status': 'success',
        'archived': note.archived,
    })


@login_required
@require_POST
def move_to_trash(request, note_id):
    user = request.user
    note = get_object_or_404(Note, pk=note_id, user=user)
    note.trashed = True
    note.trashed_at= timezone.now()
    note.save()
    messages.success(request, "Note moved to trash")
    # return redirect(reverse('notes:note'))
    return JsonResponse({
        'status': 'success',
        'message': 'Note moved to trash successfully.'
    })

@login_required
def restore_from_trash(request, note_id):
    if request.method=="POST":
        note = get_object_or_404(Note, id=note_id, user=request.user, trashed=True)
        note.trashed = False
        note.trashed_at= None
        note.save()
        messages.success(request, "Note restored successfully")
        return JsonResponse({
        'status': 'success',
        'message': 'Note restored.'
    })

    
@login_required
def delete_note(request, note_id):
    note = get_object_or_404(Note, id=note_id, user=request.user, trashed=True)
    note.trashed=False
    note.delete()
    messages.success(request, "Label deleted successfully")
    return JsonResponse({
        'status': 'success',
        'message': 'Note deleted permanently'
    })

    

@login_required
def trash_list(request):
    if request.method== "GET":
        trashed_notes = Note.objects.filter(user=request.user, trashed=True).order_by('-updated')
        return render(request, 'notes/note/trash_list.html', {'trashed_notes': trashed_notes})


@login_required
def trash_note_detail(request, note_id):
    user= request.user
    note = get_object_or_404(Note, pk=note_id, user= user, trashed=True)
    if request.method == 'GET':
        return JsonResponse({
        'id': note.id,
        'title': note.title,
        'body': note.body,
        'trashed_at': format_updated_time(note.trashed_at), 

    })


@login_required
def toggle_pinned_status(request, note_id):
    user = request.user
    note = get_object_or_404(Note, user=user, pk=note_id, trashed=False)
    if request.method== 'POST':
        # Toggle the pinned status
        note.pinned = not note.pinned
        note.save()
        if note.pinned==True:
            messages.success(request, "Note pinned")
        else:
            messages.success(request, "Note unpinned")

    return JsonResponse({
        'status': 'success',
        'pinned': note.pinned,
    })