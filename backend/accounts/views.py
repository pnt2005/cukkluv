from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from accounts.serializers import RegisterSerializer, UserSerializer
from accounts.models import Profile
from accounts.serializers import ProfileSerializer, UserProfileSerializer

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Xoá token để user đăng xuất
        request.user.auth_token.delete()
        return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'User registered successfully.',
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    def patch(self, request):
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
        """Xóa tài khoản user"""
        user = request.user
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
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
    