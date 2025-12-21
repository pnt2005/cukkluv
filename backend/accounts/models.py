from django.db import models
from django.contrib.auth.models import User

def user_avatar_path(instance, filename):
    """
        Hàm để xác định đường dẫn lưu trữ ảnh đại diện người dùng.
        Input:
            instance: instance của Profile
            filename: tên tệp gốc của ảnh đại diện
        Output:
            Đường dẫn lưu trữ ảnh đại diện dưới dạng chuỗi.
    """
    # lưu file vào thư mục media/avatars/user_<id>/
    return f'user_{instance.user.id}/{filename}'

class Profile(models.Model):
    """Model Profile mở rộng thông tin người dùng"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to=user_avatar_path, 
        null=True,
        blank=True, 
        default='default_avatar.jpg'
    )

    def __str__(self):
        return self.user.username
