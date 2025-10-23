from django.urls import path
from recipes import views

urlpatterns = [
    # RECIPE API URLS

    # Danh sách recipes và tạo mới
    path('recipes', views.recipe_list_create, name='recipe_list_create'),
    # Chi tiết, cập nhật, xóa recipe
    path('recipes/<int:pk>/', views.recipe_detail, name='recipe_detail'),
    # Recipes của user hiện tại
    path('recipes/my-recipes/', views.my_recipes, name='my_recipes'),
    # Nhân bản recipe
    path('recipes/<int:pk>/duplicate/', views.duplicate_recipe, name='recipe_duplicate'),

    # TAG API URLS

    # Danh sách tags và tạo mới
    path('tags/', views.tag_list_create, name='tag_list_create'),
    # Chi tiết, cập nhật, xóa tag
    path('tags/<int:pk>/', views.tag_detail, name='tag_detail'),
    # Recipes theo tag
    path('tags/<int:pk>/recipes/', views.tag_recipes, name='tag_recipes'),
]