from rest_framework import serializers
from .models import Tag, RecipeTag
from recipes.models import Recipe

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'