from django.urls import path
from . import views

urlpatterns = [
    # Danh sách recipes và tạo mới
    path('', views.RecipeListCreate, name='recipe-list-create'),
    # Chi tiết, cập nhật, xóa recipe
    path('<int:pk>/', views.RecipeDetail, name='recipe-detail'),
    # Tìm kiếm recipes
    path('search/', views.RecipeSearch, name='recipe-search'),
]