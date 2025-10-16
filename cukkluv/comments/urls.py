from django.urls import path
from . import views

urlpatterns = [
    path('posts/<int:post_id>/comment/', views.add_comment, name='add_comment'),
]