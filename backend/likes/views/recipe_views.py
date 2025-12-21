from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Like
from recipes.models import Recipe
from ..serializers import LikeSerializer


class LikeRecipeView(APIView):
    """Xử lý lấy và tạo lượt thích cho công thức nấu ăn"""
    def get_permissions(self):
        """
            Xác định quyền truy cập dựa trên phương thức yêu cầu.
            Input:
                None
            Output:
                Danh sách các lớp quyền áp dụng cho yêu cầu hiện tại.
        """
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return []

    def get(self, request, recipe_id):
        """
            Lấy danh sách lượt thích cho công thức nấu ăn cụ thể.
            Input:
                request: Yêu cầu HTTP.
                recipe_id: ID của công thức nấu ăn.
            Output:
                Response: Phản hồi HTTP với danh sách lượt thích và thông tin người dùng đã thích
        """
        recipe = get_object_or_404(Recipe, id=recipe_id)
        likes = Like.objects.filter(recipe=recipe)
        serializer = LikeSerializer(likes, many=True)
        user_liked = likes.filter(user=request.user).exists()

        return Response({
            'total_likes': likes.count(),
            'likes': serializer.data,
            'user_liked': user_liked
        }, status=status.HTTP_200_OK)

    def post(self, request, recipe_id):
        """
            Tạo hoặc xoá lượt thích cho công thức nấu ăn cụ thể.
            Input:
                request: Yêu cầu HTTP từ người dùng đã xác thực.
                recipe_id: ID của công thức nấu ăn.
            Output:
                Response: Phản hồi HTTP với dữ liệu lượt thích mới tạo hoặc xác nhận xoá lượt thích.
        """
        user = request.user

        # Chỉ được like 1 loại: post hoặc recipe
        if not recipe_id:
            return Response({'error': 'Need recipe_id'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            recipe = get_object_or_404(Recipe, id=recipe_id)
            like, created = Like.objects.get_or_create(user=user, recipe=recipe)

        # Nếu đã tồn tại thì unlike
        if not created:
            like.delete()
            return Response({'message': 'unlike success'}, status=status.HTTP_200_OK)

        # Nếu vừa tạo mới
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
