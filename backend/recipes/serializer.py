from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, Tag, RecipeTag

class UserSerializer(serializers.ModelSerializer):
    """Serializer cho User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class TagSerializer(serializers.ModelSerializer):
    """Serializer cho Tag model"""
    class Meta:
        model = Tag
        fields = ['id', 'name']
        read_only_fields = ['id']

class RecipeTagSerializer(serializers.ModelSerializer):
    """Serializer cho RecipeTag Model"""
    tag_name = serializers.CharField(source='tag_name', read_only=True)
    
    class Meta:
        model = RecipeTag
        fields = ['id', 'recipe', 'tag', 'tag_name']
        read_only_fields = ['id']

class RecipeSerializer(serializers.ModelSerializer):
    """Serializer cho Recipe model với đầy đủ thông tin"""
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Recipe
        fields = [
            'id', 'author', 'author_id', 'title', 'description',
            'ingredients', 'steps', 'image', 'created_at',
            'tags', 'tag_ids'
        ]
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        recipe = Recipe.objects.create(**validated_data)

        # Tạo quan hệ many-to-many với tags
        for tag_id in tag_ids:
            try:
                tag = Tag.objects.get(id=tag_id)
                RecipeTag.objects.create(recipe=recipe, tag=tag)
            except Tag.DoesNotExist:
                pass
        return recipe
    
    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)

        # Cập nhật các trường thông thường
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Cập nhật tags nếu được cung cấp
        if tag_ids is not None:
            # Xóa tất cả tags hiện tại
            RecipeTag.objects.filter(recipe=instance).delete()

            # Thêm tags mới
            for tag_id in tag_ids:
                try:
                    tag = Tag.objects.get(id=tag_id)
                    RecipeTag.objects.create(recipe=instance, tag=tag)
                except Tag.DoesNotExist:
                    pass

        return instance
    
class RecipeListSerializer(serializers.ModelSerializer):
    """Serializer đơn giản cho danh sách recipes"""
    author_name = serializers.CharField(source='author.username', read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = [
            'id', 'author_name', 'title', 'description',
            'image', 'created_at', 'tags'
        ]
        read_only_fields = fields

class RecipeCreateSerializer(serializers.ModelSerializer):
    """Serializer cho việc tạo recipe mới với tag names"""
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False
    )

    class Meta:
        model = Recipe
        fields = [
            'title', 'description', 'ingredients',
            'steps', 'image', 'tag_names'
        ]

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])

        # Lấy user từ context (thường được set trong view)
        user = self.context['context'].user
        recipe = Recipe.object.create(author=user, **validated_data)

        #Tạo hoặc lấy tags và tạo quan hệ
        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(name=tag_name.strip())
            RecipeTag.objects.create(recipe=recipe, tag=tag)

        return recipe

