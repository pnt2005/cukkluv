from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Like
from comments.models import Comment
from ..serializers import LikeSerializer


class LikeCommentView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return []

    def get(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        likes = Like.objects.filter(comment=comment)
        serializer = LikeSerializer(likes, many=True)
        user_liked = likes.filter(user=request.user).exists()

        return Response({
            'total_likes': likes.count(),
            'likes': serializer.data,
            'user_liked': user_liked
        }, status=status.HTTP_200_OK)

    def post(self, request, comment_id):
        user = request.user

        if not comment_id:
            return Response({'error': 'Need comment_id'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            comment = get_object_or_404(Comment, id=comment_id)
            like, created = Like.objects.get_or_create(user=user, comment=comment)

        # Nếu đã tồn tại thì unlike
        if not created:
            like.delete()
            return Response({'message': 'unlike success'}, status=status.HTTP_200_OK)

        # Nếu vừa tạo mới
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)