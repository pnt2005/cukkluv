from django.contrib import admin
from .models import Tag, RecipeTag, PostTag

# Register your models here.
admin.site.register(Tag)
admin.site.register(RecipeTag)
admin.site.register(PostTag)