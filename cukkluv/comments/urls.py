from django.urls import path
from . import views

urlpatterns = [
    path('posts/<int:post_id>/', views.get_comments, name='get_comments'),
    path('posts/<int:post_id>/add/', views.add_comment, name='add_comment'),
    path('<int:comment_id>/edit/', views.edit_comment, name='edit_comment'),
    path('<int:comment_id>/delete/', views.delete_comment, name='delete_comment'),
]