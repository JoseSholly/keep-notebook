from django.db import models
from django.urls import reverse

# Create your models here.


class Label(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    class Meta:
        verbose_name = "Label"
        verbose_name_plural= "Labels"


    def __str__(self):
        return self.name

class Note(models.Model):
    title= models.CharField(max_length=100, null=False)
    body= models.TextField()
    label= models.ForeignKey(Label, on_delete=models.SET_NULL, related_name="notes", blank=True, null=True)
    archived= models.BooleanField(default=False)
    pinned= models.BooleanField(default= False)
    created = models.DateTimeField(auto_now_add= True)
    updated= models.DateTimeField(auto_now=True)


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