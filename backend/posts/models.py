from django.db import models
from django.contrib.auth.models import User

def user_directory_path(instance, filename):
    """
        Hàm để xác định đường dẫn lưu trữ ảnh bài viết.
        Input:
            instance: instance của Post
            filename: tên tệp gốc của ảnh bài viết
        Output:
            Đường dẫn lưu trữ ảnh bài viết dưới dạng chuỗi.
    """
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'user_{instance.author.id}/{filename}'

class Post(models.Model):
    """Model Post để lưu trữ bài viết của người dùng"""
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    image = models.ImageField(upload_to=user_directory_path)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author.username} at {self.created_at}"
    
