from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe
from posts.models import Post

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    post =models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    def __str__(self):
        return f'Comment by {self.user.username}'