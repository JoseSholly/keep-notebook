from django.shortcuts import render, redirect
from django.urls import reverse
from django. contrib.auth import login, authenticate, logout
from .forms import CustomUserCreationForm, CustomAuthenticationForm, CustomPasswordResetForm, CustomSetPasswordForm, CustomPasswordChangeForm
from django.contrib import messages

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


def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        
        if form.is_valid():
            email = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return redirect(reverse('notes:note_list'))
            else:
                messages.error(request, 'Invalid email or password.')
        else:
            messages.error(request, 'Invalid email or password.')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'users/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return render(request, 'users/logout.html')