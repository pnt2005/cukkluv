from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    """Serializer cho model User bao gồm avatar từ Profile"""
    avatar = serializers.SerializerMethodField()

    class Meta:
        """Meta cho UserSerializer"""
        model = User
        fields = ['id', 'username', 'email', 'avatar']

    def get_avatar(self, obj):
        """
            Phương thức để lấy avatar của người dùng từ Profile
            Input:
                obj: instance của User
            Output:
                URL của avatar dưới dạng chuỗi.
        """
        profile = getattr(obj, "profile", None)
        if profile and profile.avatar:
            return profile.avatar.url
        return "/media/default_avatar.jpg"  # avatar mặc định


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer để đăng ký người dùng mới"""
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        """Meta cho RegisterSerializer"""
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        """
            Ghi đè phương thức create để tạo người dùng mới với mật khẩu đã mã hóa.
            Input:
                validated_data: dữ liệu đã được xác thực
            Output:
                instance của User mới tạo.
        """
        user = User.objects.create_user(**validated_data)
        return user
    