from django.urls import path
from .views import TagView, TagDetailView

urlpatterns = [
    path('', TagView.as_view(), name='tag-list-create'),
    path('<int:pk>/', TagDetailView.as_view(), name='tag-detail'),
]
