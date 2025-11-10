from rest_framework import serializers
from .models import Tag, RecipeTag
from recipes.models import Recipe


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

# --- Recipe Serializer (có thể thêm tag khi tạo) ---
class RecipeSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True,
        required=False
    )
    tag_objects = TagSerializer(source='recipetag_set', many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'tags', 'tag_objects']

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        recipe = Recipe.objects.create(**validated_data)
        for tag_name in tags:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            RecipeTag.objects.create(recipe=recipe, tag=tag)
        return recipe

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags is not None:
            # Xóa tag cũ
            instance.recipetag_set.all().delete()
            # Thêm tag mới
            for tag_name in tags:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                RecipeTag.objects.create(recipe=instance, tag=tag)
        return instance
