from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe

class Save(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saves')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='saves')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f'{self.user.username} saved {self.recipe.title}'

