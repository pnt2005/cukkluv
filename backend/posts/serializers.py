from rest_framework import serializers
from .models import Post
from accounts.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    """Serializer cho model Post"""
    author = UserSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
    
    def get_like_count(self, obj):
        """
            Lấy số lượng lượt thích cho bài viết hiện tại
            Input:
                obj: instance của Post
            Output:
                Số lượng lượt thích cho bài viết hiện tại.
        """
        return obj.likes.count()

    def get_comment_count(self, obj):
        """
            Lấy số lượng bình luận cho bài viết hiện tại
            Input:
                obj: instance của Post
            Output:
                Số lượng bình luận cho bài viết hiện tại.
        """
        return obj.comments.count()
    
    def get_user_liked(self, obj):
        """
            Kiểm tra xem người dùng hiện tại có thích bài viết này không
            Input:
                obj: instance của Post
            Output:
                Boolean cho biết người dùng hiện tại có thích bài viết này không.
        """
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False