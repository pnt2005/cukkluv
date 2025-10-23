from django.shortcuts import get_object_or_404
from posts.models import Post
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class CommentListCreateView(APIView):
    def get(self, request, post_id):
        comments = Comment.objects.filter(post__id=post_id).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CommentDetailView(APIView):
    def put(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, user=request.user)
        serializer = CommentSerializer(comment, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, user=request.user)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)