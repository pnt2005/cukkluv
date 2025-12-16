import nested_admin
from django.contrib import admin
from .models import Recipe, Step, StepImage

# Inline ảnh cho từng bước
class StepImageInline(nested_admin.NestedTabularInline):
    model = StepImage
    extra = 1
    fields = ('image',)

# Inline bước cho Recipe, kèm cả inline ảnh
class StepInline(nested_admin.NestedTabularInline):
    model = Step
    extra = 1
    fields = ('order', 'text')
    inlines = [StepImageInline]  # lồng inline ảnh vào Step

# Recipe admin
@admin.register(Recipe)
class RecipeAdmin(nested_admin.NestedModelAdmin):
    inlines = [StepInline]
    list_display = ('title', 'author', 'created_at', 'cookTime', 'views')
    search_fields = ('title', 'author__username')
