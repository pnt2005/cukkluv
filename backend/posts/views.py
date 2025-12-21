from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from posts.serializers import PostSerializer
from posts.models import Post
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

class PostListCreateView(APIView):
    """Xử lý lấy danh sách và tạo mới bài viết"""
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
    
    def get(self, request):
        """
            Lấy danh sách bài viết với phân trang và lọc theo thẻ (tag).
            Input:
                request: Yêu cầu HTTP.
            Output:
                Response: Phản hồi HTTP với danh sách bài viết phân trang.
        """
        paginator = PageNumberPagination()
        paginator.page_size = 5
        tag_name = request.query_params.get('tag', None)
        posts = Post.objects.all().order_by('-created_at')
        if tag_name:
            posts = posts.filter(posttag__tag__name=tag_name).distinct()
        result_page = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(result_page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        """
            Tạo mới bài viết.
            Input:
                request: Yêu cầu HTTP chứa dữ liệu bài viết.
            Output:
                Response: Phản hồi HTTP với dữ liệu bài viết mới tạo hoặc lỗi nếu thất bại.
        """
        serializer = PostSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class PostDetailView(APIView):
    """Xử lý lấy, cập nhật và xoá bài viết cụ thể"""
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
    
    def get(self, request, pk):
        """
            Lấy chi tiết bài viết cụ thể.
            Input:
                request: Yêu cầu HTTP.
                pk: ID của bài viết.
            Output:
                Response: Phản hồi HTTP với dữ liệu bài viết.
        """
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)
    
    def patch(self, request, pk):
        """
            Cập nhật một bài viết cụ thể.
            Input:
                request: Yêu cầu HTTP chứa dữ liệu cập nhật.
                pk: ID của bài viết cần cập nhật.
            Output:
                Response: Phản hồi HTTP với dữ liệu bài viết đã cập nhật hoặc lỗi nếu thất bại.
        """
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        """
            Xoá một bài viết cụ thể.
            Input:
                request: Yêu cầu HTTP.
                pk: ID của bài viết cần xoá.
            Output:
                Response: Phản hồi HTTP với mã trạng thái 204 nếu xoá thành công.
        """
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return Response(status=204)