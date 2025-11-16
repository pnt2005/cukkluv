from rest_framework import serializers
from .models import Post
from accounts.serializers import UserSerializer
from tags.serializers import TagSerializer
from tags.models import Tag, PostTag

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False
    )
    tag_objects = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
    
    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comment_count(self, obj):
        return obj.comments.count()
    
    def get_user_liked(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False
    
    def get_tag_objects(self, obj):
        tags = [pt.tag for pt in obj.posttag_set.all()]
        return TagSerializer(tags, many=True).data

    def create(self, validated_data):
        tags = validated_data.pop('tags', '')
        post = Post.objects.create(**validated_data)
        if isinstance(tags, list):
            tags = ','.join(tags)
        tag_names = [t.strip() for t in tags.split(',')]
        for tag_name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            PostTag.objects.create(post=post, tag=tag)
        return post

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags is not None:
            instance.posttag_set.all().delete()
            for tag_name in tags:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                PostTag.objects.create(post=instance, tag=tag)
        return instance