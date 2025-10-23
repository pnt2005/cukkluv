from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe
from posts.models import Post

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='likes', null=True, blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes', null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'recipe', 'post')
    def __str__(self):
        if self.recipe:
            return f'{self.user.username} liked recipe {self.recipe.title}'
        return f'{self.user.username} liked post {self.post.id}'