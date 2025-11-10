from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Recipe

class RecipeSerializer(serializers.ModelSerializer):
    """Serializer cho Recipe model với đầy đủ thông tin"""
    # Override trường author (nếu Django tự động sẽ chỉ tạo trường author_id, override để hiển thị id, username, email)
    author = UserSerializer(read_only=True)
    # Trường chưa có trong model nhưng muốn hiển thị thêm
    like_count = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()
    views = serializers.IntegerField(read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'
    
    def get_like_count(self, obj):
        return obj.likes.count()
    
    def get_user_liked(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

