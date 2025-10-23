from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from recipes.models import Recipe, Tag, RecipeTag
from recipes.serializer import (
    RecipeSerializer,
    RecipeListSerializer,
    RecipeCreateSerializer,
    TagSerializer
)

# RECIPE VIEW

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def recipe_list_create(request):
    """
    GET /api/recipes/ - Lấy danh sách recipes
    POST /api/recipes/ - Tạo recipe mới
    """

    if request.method == 'GET':
        # Lấy danh sách recipes theo thời gian tạo
        recipes = Recipe.objects.all().order_by('-created_at')
        serializer = RecipeListSerializer(recipes, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Tạo recipe mới
        serializer = RecipeCreateSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            # Tự động gán author = user hiện tại
            serializer.save(author=request.user)

            # Trả về response với serializer đầy đủ
            recipe = serializer.instance
            output_serializer = RecipeSerializer(recipe)

            return Response(
                output_serializer.data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def recipe_detail(request, pk):
    """
    GET /api/recipes{id}/ - Lấy chi tiết recipe
    PUT /api/recipes{id}/ - Cập nhật toàn bộ recipe
    PATCH /api/recipes{id}/ - Cập nhật 1 phần recipe
    DELETE /api/recipes{id}/ - Xóa recipe
    """

    recipe = get_object_or_404(Recipe, pk=pk)

    if request.method == 'GET':
        # Lấy chi tiết recipe
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Cập nhật toàn bộ recipe
        serializer = RecipeSerializer(recipe, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    elif request.method == 'PATCH':
        # Cập nhật 1 phần recipe
        serializer = RecipeSerializer(
            recipe,
            data=request.data,
            partial=True # Cho phép update 1 phần
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    elif request.method == 'DELETE':
        # Xóa recipe
        recipe.delete()
        return Response(
            {'success': True, 'message ': 'Recipe deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_recipes(request):
    """
    GET recipes/my-recipes/ - Lấy danh sách recipes của user hiện tại
    """

    recipes = Recipe.objects.filter(author=request.user).order_by('-created-at')
    serializer = RecipeListSerializer(recipes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def duplicate_recipe(request, pk):
    """
    POST recipes/{id}/duplicate/ - Nhân bản recipe
    """
    original_recipe = get_object_or_404(Recipe, pk=pk)

    # Tạo recipe mới
    new_recipe = Recipe.objects.create(
        author=request.user,
        title=f"{original_recipe.title} (Copy)",
        description=original_recipe.description,
        ingredients=original_recipe.ingredients,
        steps=original_recipe.steps,
        image=original_recipe.image
    )

    # Copy tags
    for recipe_tag in original_recipe.recipetag_set.all():
        RecipeTag.objects.create(recipe=new_recipe, tag=recipe_tag.tag)
    
    serializer = RecipeSerializer(new_recipe)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# TAG VIEWS

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def tag_list_create(request):
    """
    GET tags/ - Lấy danh sách tags
    POST tags/ - Tạo tag mới
    """
    if request.method == 'GET':
        # Lấy danh sách tag
        tags = Tag.objects.all().order_by('name')
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Tạo tag mới
        serializer = TagSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def tag_detail(request, pk):
    """
    GET tags/{id}/ - Lấy chi tiết tag
    PUT tags/{id}/ - Cập nhật tag
    DELETE tags/{id}/ - Xóa tag
    """
    tag = get_object_or_404(Tag, pk=pk)

    if request.method == 'GET':
        # Lấy chi tiết tag
        serializer = TagSerializer(tag)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Cập nhật tag
        serializer = TagSerializer(tag, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    elif request.method == 'DELETE':
        # Xóa tag
        tag.delete()
        return Response(
            {'success': True, 'message': 'Tag deleted sucessfully'},
            status=status.HTTP_204_NO_CONTENT
        )

@api_view(['GET'])
def tag_recipes(request, pk):
    """
    GET tags/{id}/recipes/ - Lấy tất cả recipes có tag này
    """
    tag = get_object_or_404(Tag, pk=pk)
    recipes = Recipe.objects.filter(tags=tag).order_by('-created_at')
    serializer = RecipeListSerializer(recipes, many=True)
    return Response(serializer.data)
