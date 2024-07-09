from django.db import models

# Create your models here.


class Note(models.Model):
    title= models.CharField(max_length=100, null=False)
    body= models.TextField()
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

    
