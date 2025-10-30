from django.urls import path
from .views.post_views import LikePostView
from .views.recipe_views import LikeRecipeView
from .views.comment_views import LikeCommentView

urlpatterns = [
    path('posts/<int:post_id>/', LikePostView.as_view(), name='like-post'),
    path('recipes/<int:post_id>/', LikeRecipeView.as_view(), name='like-recipe'),
    path('comments/<int:comment_id>/', LikeCommentView.as_view(), name='like-comment'),
]
