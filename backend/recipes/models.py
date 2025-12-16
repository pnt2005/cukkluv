from django.db import models
from django.contrib.auth.models import User

def user_directory_path(instance, filename):
    # Recipe.image
    if hasattr(instance, 'author'):
        return f'user_{instance.author.id}/recipes/{filename}'

    # StepImage.image
    if hasattr(instance, 'step') and instance.step and hasattr(instance.step, 'recipe'):
        return f'user_{instance.step.recipe.author.id}/steps/{filename}'

    return f'others/{filename}'



class Recipe(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    ingredients = models.TextField()
    image = models.ImageField(upload_to=user_directory_path)
    created_at = models.DateTimeField(auto_now_add=True)
    cookTime = models.CharField(max_length=50, default=0)
    views = models.IntegerField(default=0)
    portion = models.IntegerField(default=1)

class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    text = models.TextField()
    order = models.IntegerField(default=0)

class StepImage(models.Model):
    step = models.ForeignKey(Step, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to=user_directory_path)
