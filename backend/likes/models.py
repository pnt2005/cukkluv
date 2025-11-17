from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe
from posts.models import Post
from comments.models import Comment

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='likes', null=True, blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes', null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes', null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post_like'),
            models.UniqueConstraint(fields=['user', 'recipe'], name='unique_user_recipe_like'),
            models.UniqueConstraint(fields=['user', 'comment'], name='unique_user_comment_like'),
        ]
    def __str__(self):
        if self.recipe:
            return f'{self.user.username} liked recipe {self.recipe.title}'
        if self.comment:
            return f'{self.user.username} liked comment {self.comment.id}'
        return f'{self.user.username} liked post {self.post.id}'