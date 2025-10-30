from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Like
from posts.models import Post
from ..serializers import LikeSerializer


class LikePostView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return []
    
    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        likes = Like.objects.filter(post=post)
        serializer = LikeSerializer(likes, many=True)
        user_liked = False
        if request.user.is_authenticated:
            user_liked = likes.filter(user=request.user).exists()

        return Response({
            'total_likes': likes.count(),
            'likes': serializer.data,
            'user_liked': user_liked
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
