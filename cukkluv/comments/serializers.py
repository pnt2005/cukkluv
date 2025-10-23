from rest_framework import serializers
from accounts.serializers import UserSerializer
from posts.serializers import PostSerializer
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
