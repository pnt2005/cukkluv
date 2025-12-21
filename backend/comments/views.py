from django.shortcuts import get_object_or_404
from posts.models import Post
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

class CommentListCreateView(APIView):
    """Xử lý lấy danh sách và tạo mới bình luận cho bài viết"""
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

    def get(self, request, post_id):
        """
            Lấy danh sách bình luận cho bài viết cụ thể với phân trang.
            Input:
                request: Yêu cầu HTTP.
                post_id: ID của bài viết.
            Output:
                Response: Phản hồi HTTP với danh sách bình luận phân trang.
        """
        paginator = PageNumberPagination()
        paginator.page_size = 10
        comments = Comment.objects.filter(post__id=post_id, parent=None).order_by('-created_at')
        result_page = paginator.paginate_queryset(comments, request)
        serializer = CommentSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, post_id):
        """
            Tạo mới bình luận cho bài viết cụ thể.
            Input:
                request: Yêu cầu HTTP chứa dữ liệu bình luận.
                post_id: ID của bài viết.
            Output:
                Response: Phản hồi HTTP với dữ liệu bình luận mới tạo hoặc lỗi nếu thất bại.
        """
        post = get_object_or_404(Post, id=post_id)
        parent_id = request.data.get("parent_id")
        parent = None
        if parent_id:
            parent = Comment.objects.filter(id=parent_id, post=post).first()
        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user, post=post, parent=parent)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailView(APIView):
    """Xử lý lấy, cập nhật và xóa bình luận cụ thể"""
    def get_permissions(self):
        """
            Xác định quyền truy cập dựa trên phương thức yêu cầu.
            Input:
                None
            Output:
                Danh sách các lớp quyền áp dụng cho yêu cầu hiện tại.
        """
        if self.request.method == 'GET':
            return []
        else:
            return [IsAuthenticated()]
    
    def get(self, request, comment_id):
        """
            Lấy thông tin chi tiết của bình luận cụ thể.
            Input:
                request: Yêu cầu HTTP.
                comment_id: ID của bình luận.
            Output:
                Response: Phản hồi HTTP với dữ liệu bình luận hoặc lỗi nếu không tìm thấy.
        """
        comment = get_object_or_404(Comment, id=comment_id)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, comment_id):
        """
            Cập nhật bình luận cụ thể.
            Input:
                request: Yêu cầu HTTP chứa dữ liệu cập nhật.
                comment_id: ID của bình luận.
            Output:
                Response: Phản hồi HTTP với dữ liệu bình luận đã cập nhật hoặc lỗi nếu thất bại.
        """
        comment = get_object_or_404(Comment, id=comment_id, user=request.user)
        serializer = CommentSerializer(comment, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        """
            Xóa bình luận cụ thể.
            Input:
                request: Yêu cầu HTTP.
                comment_id: ID của bình luận.
            Output:
                Response: Phản hồi HTTP xác nhận xóa thành công hoặc lỗi nếu thất bại.
        """
        comment = get_object_or_404(Comment, id=comment_id, user=request.user)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)