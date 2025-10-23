from django.urls import path
from .views import LikePostView, LikeRecipeView

urlpatterns = [
    path('posts/<int:post_id>/', LikePostView.as_view(), name='like-post'),
    path('recipes/<int:post_id>/', LikeRecipeView.as_view(), name='like-recipe'),
]
