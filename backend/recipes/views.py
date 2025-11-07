from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from recipes.models import Recipe
from django.shortcuts import get_object_or_404
from recipes.serializer import RecipeSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def RecipeListCreate(request):

    """
    GET /api/recipes/ - Lấy danh sách recipes khi tìm kiếm và hiển thị 5 recipe/trang (phân trang)
    POST /api/recipes/ - Tạo recipe mới
    """

    if request.method == 'GET':
        paginator = PageNumberPagination()
        paginator.page_size = 5
        recipes = Recipe.objects.all().order_by('-created_at')
        result_page = paginator.paginate_queryset(recipes, request)
        serializer = RecipeSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        # Tạo recipe mới
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            # Tự động gán author = user hiện tại
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def RecipeDetail(request, pk):
    """
    GET /api/recipes/{id}/ - Lấy chi tiết recipe
    PUT /api/recipes/{id}/ - Cập nhật toàn bộ recipe
    PATCH /api/recipes/{id}/ - Cập nhật 1 phần recipe
    DELETE /api/recipes/{id}/ - Xóa recipe
    """

    recipe = get_object_or_404(Recipe, pk=pk)

    if request.method == 'GET':
        # Tăng lượt xem mỗi khi người dùng truy cập chi tiết
        recipe.views += 1
        recipe.save(update_fields=['views'])
        # Lấy chi tiết recipe
        serializer = RecipeSerializer(recipe, context={'request': request})
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        # Kiểm tra quyền sở hữu
        if recipe.author != request.user:
            return Response(
                {'error': 'You do not have permission to edit this recipe'},
                status=403
            )
        # Cập nhật recipe
        serializer = RecipeSerializer(recipe, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        # Kiểm tra quyền sở hữu
        if recipe.author != request.user:
            return Response(
                {'error': 'You do not have permission to delete this recipe'},
                status=403
            )
        # Xóa recipe
        recipe.delete()
        return Response(
            {'success': True, 'message': 'Recipe deleted successfully'},
            status=204
        )



