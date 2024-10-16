from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordResetForm, SetPasswordForm, PasswordChangeForm
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser
from django. contrib.auth import login, authenticate
import re

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'class': 'form-control', 'id': 'id_email'}))
    first_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'class': 'form-control', 'id': 'id_first_name'}))
    last_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'class': 'form-control', 'id': 'id_last_name'}))
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-control', 'id': 'id_password1'}))
    password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput(attrs={'class': 'form-control', 'id': 'id_password2'}))
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('email','first_name', 'last_name',)
        

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'is_active', 'is_staff')


class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label='Email', max_length=254, widget=forms.TextInput(attrs={'class': 'form-control', 'id': 'form2Example1'}), error_messages={
            'invalid': 'Enter a valid email address.',
        })
    password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-control', 'id': 'form2Example2'}))


    def clean_username(self):
        email = self.cleaned_data.get('username')
        if not email:
            raise forms.ValidationError("This field is required.")
        if '@' not in email or '.' not in email:
            raise forms.ValidationError("Enter a valid email address.")
        return email


class CustomPasswordResetForm(PasswordResetForm):
    email = forms.EmailField(label='Email', max_length=254, widget=forms.EmailInput(attrs={'autocomplete': 'email'}))

class CustomSetPasswordForm(SetPasswordForm):
    class Meta:
        model = CustomUser

class CustomPasswordChangeForm(PasswordChangeForm):
    class Meta:
        model = CustomUser

