from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from accounts.serializers import RegisterSerializer, UserSerializer

class LoginView(APIView):
    """Xử lý đăng nhập người dùng"""
    def post(self, request):
        """
            Xử lý yêu cầu đăng nhập người dùng.
            Input:
                request: Yêu cầu HTTP chứa thông tin đăng nhập.
            Output:
                Response: Phản hồi HTTP với token nếu đăng nhập thành công hoặc lỗi nếu thất bại.
        """
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Xử lý đăng xuất người dùng"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
            Xử lý yêu cầu đăng xuất người dùng.
            Input:
                request: Yêu cầu HTTP từ người dùng đã xác thực.
            Output:
                Response: Phản hồi HTTP xác nhận đăng xuất thành công.
        """
        # Xoá token để user đăng xuất
        request.user.auth_token.delete()
        return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """Xử lý đăng ký người dùng mới"""
    def post(self, request):
        """
            Xử lý yêu cầu đăng ký người dùng mới.
            Input:
                request: Yêu cầu HTTP chứa thông tin đăng ký.
            Output:
                Response: Phản hồi HTTP với thông tin người dùng mới tạo và token nếu thành công.
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'User registered successfully.',
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """Xử lý thông tin người dùng hiện tại"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
            Lấy thông tin người dùng hiện tại
            Input:
                request: Yêu cầu HTTP từ người dùng đã xác thực.
            Output:
                Response: Phản hồi HTTP với thông tin người dùng.
        """
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    def patch(self, request):
        """
            Cập nhật thông tin người dùng hiện tại.
            Input:
                request: Yêu cầu HTTP từ người dùng đã xác thực với dữ liệu cập nhật.
            Output:
                Response: Phản hồi HTTP với thông tin người dùng đã cập nhật.
        """
        user = request.user
        profile = user.profile

        # update User
        user.username = request.data.get("username", user.username)
        user.email = request.data.get("email", user.email)
        user.save()

        # update avatar
        avatar = request.FILES.get("avatar")
        if avatar:
            profile.avatar = avatar
            profile.save()

        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=200)

    def delete(self, request):
        """
            Xóa tài khoản user
            Input:
                request: Yêu cầu HTTP từ người dùng đã xác thực.
            Output:
                Response: Phản hồi HTTP xác nhận xóa tài khoản thành công.
        """
        user = request.user
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(APIView):
    """Xử lý thay đổi mật khẩu người dùng"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
            Xử lý yêu cầu thay đổi mật khẩu người dùng.
            Input:
                request: Yêu cầu HTTP từ người dùng đã xác thực với mật khẩu cũ và mới.
            Output:
                Response: Phản hồi HTTP xác nhận thay đổi mật khẩu thành công hoặc lỗi nếu thất bại.
        """
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        # Kiểm tra dữ liệu đầu vào
        if not old_password or not new_password:
            return Response({'error': 'Both old and new password are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra mật khẩu cũ có đúng không
        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Đặt mật khẩu mới
        user.set_password(new_password)
        user.save()

        # Xóa token cũ -> buộc user đăng nhập lại
        Token.objects.filter(user=user).delete()

        return Response({'message': 'Password changed successfully. Please log in again.'},
                        status=status.HTTP_200_OK)
    