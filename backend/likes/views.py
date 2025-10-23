from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Like
from posts.models import Post
from recipes.models import Recipe
from .serializers import LikeSerializer


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        likes = Like.objects.filter(post=post)
        serializer = LikeSerializer(likes, many=True)
        return Response({
            'total_likes': likes.count(),
            'likes': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request, post_id):
        user = request.user

        if not post_id:
            return Response({'error': 'Need post_id'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            post = get_object_or_404(Post, id=post_id)
            like, created = Like.objects.get_or_create(user=user, post=post)

        # Nếu đã tồn tại thì unlike
        if not created:
            like.delete()
            return Response({'message': 'Unlike success'}, status=status.HTTP_200_OK)
        
        # Nếu vừa tạo mới
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LikeRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
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
