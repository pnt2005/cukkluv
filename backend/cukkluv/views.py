from django.shortcuts import render

def home_view(request):
    """Hiển thị trang chủ của ứng dụng."""
    return render(request, 'app/home.html')