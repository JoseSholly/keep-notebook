from django.shortcuts import render, redirect
from django.urls import reverse
from django. contrib.auth import login
from .forms import CustomUserCreationForm, CustomAuthenticationForm, CustomPasswordResetForm, CustomSetPasswordForm, CustomPasswordChangeForm

# Create your views here.
def signup(request):
    if request.method == "POST":
        form= CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect(reverse('notes:note_list'))
    else:
        form= CustomUserCreationForm()
    return render(request, "users/registration.html", {'form': form})