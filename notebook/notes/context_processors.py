from .models import Label

def labels_processor(request):
    if request.user.is_authenticated:
        labels = Label.objects.filter(user=request.user)
    
    else:
        labels = Label.objects.none()

    return {
        'labels': labels,
    }
