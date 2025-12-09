from django.db import models
from django.contrib.auth.models import User

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'user_{instance.author.id}/{filename}'

class Recipe(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    ingredients = models.TextField()
    steps = models.TextField()
    image = models.ImageField(upload_to=user_directory_path)
    created_at = models.DateTimeField(auto_now_add=True)
    # Thêm cookTime và views
    cookTime = models.CharField(max_length=50, default=0)
    views = models.IntegerField(default=0)


    def __str__(self):
        return self.title
