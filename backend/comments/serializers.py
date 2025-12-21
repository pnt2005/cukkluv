from rest_framework import serializers
from accounts.serializers import UserSerializer
from posts.serializers import PostSerializer
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    """Serializer cho model Comment"""
    user = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_replies(self, obj):
        """
            Lấy danh sách trả lời cho bình luận hiện tại
            Input:
                obj: instance của Comment
            Output:
                Danh sách các bình luận trả lời dưới dạng serialized data.
        """
        replies = obj.replies.all().order_by('created_at')
        return CommentSerializer(replies, many=True, context=self.context).data
    
    def get_like_count(self, obj):
        """
            Lấy số lượng lượt thích cho bình luận hiện tại
            Input:
                obj: instance của Comment
            Output:
                Số lượng lượt thích cho bình luận hiện tại.
        """
        return obj.likes.count()
    
    def get_user_liked(self, obj):
        """
            Kiểm tra xem người dùng hiện tại có thích bình luận này không
            Input:
                obj: instance của Comment
            Output:
                Boolean cho biết người dùng hiện tại có thích bình luận này không.
        """
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False
