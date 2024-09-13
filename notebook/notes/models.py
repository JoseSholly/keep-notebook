from django.db import models
from django.urls import reverse
from accounts.models import CustomUser
# Create your models here.


class Label(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='labels', default=None)
    name = models.CharField(max_length=50, null=False)
    
    class Meta:
        verbose_name = "Label"
        verbose_name_plural= "Labels"


    def __str__(self):
        return self.name

class Note(models.Model):
    user= models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='notes')
    title= models.CharField(max_length=100, null=False)
    body= models.TextField()
    label= models.ManyToManyField(Label, related_name="labels", blank=True)
    archived= models.BooleanField(default=False)
    pinned= models.BooleanField(default= False)
    created = models.DateTimeField(auto_now_add= True)
    updated= models.DateTimeField(auto_now=True)
    trashed = models.BooleanField(default=False) 
    trashed_at= models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering= ['-updated']
        indexes= [
            models.Index(fields=["-updated"])
        ]
        verbose_name = "Note"
        verbose_name_plural= "Notes"

    def __str__(self) -> str:
        return self.title

    def get_label_absolute_url(self):
        if self.label:
            return reverse('notes:label_list', args=[self.label.name])
        return reverse('notes:notes')
    