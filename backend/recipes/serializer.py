from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Recipe, Step, StepImage
from django.db import transaction
import json

class StepImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StepImage
        fields = ['id', 'image']

class StepSerializer(serializers.ModelSerializer):
    images = StepImageSerializer(many=True)
    """Serializer cho Step model"""
    class Meta:
        model = Step
        fields = ['id', 'order', 'text', 'images']

class RecipeSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    steps = serializers.JSONField(write_only=True)
    steps_detail = StepSerializer(source="steps", many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'

    def create(self, validated_data):
        steps_data = validated_data.pop("steps", [])

        recipe = Recipe.objects.create(**validated_data)

        for step_data in steps_data:
            images_data = step_data.pop("images", [])
            step = Step.objects.create(recipe=recipe, **step_data)
            for img in images_data:
                StepImage.objects.create(step=step, **img)

        return recipe
        
    def update(self, instance, validated_data):
            request = self.context["request"]
            
            with transaction.atomic():
                # =============================
                # 1. UPDATE RECIPE FIELDS
                # =============================
                for field in ["title", "description", "ingredients", "cookTime", "portion"]:
                    if field in validated_data:
                        setattr(instance, field, validated_data[field])

                if "image" in request.FILES:
                    instance.image = request.FILES["image"]

                instance.save()

                # =============================
                # 2. PARSE STEPS JSON
                # =============================
                steps_raw = request.data.get("steps")
                if steps_raw:
                    steps_data = json.loads(steps_raw)
                else:
                    steps_data = []

                existing_steps = {step.id: step for step in instance.steps.all()}
                received_step_ids = set()

                # =============================
                # 3. UPDATE / CREATE STEPS
                # =============================
                for step_data in steps_data:
                    step_id = step_data.get("id")
                    if step_id and step_id in existing_steps:
                        step = existing_steps[step_id]
                        step.text = step_data.get("text", step.text)
                        step.order = step_data.get("order", step.order)
                        step.save()
                    else:
                        step = Step.objects.create(
                            recipe=instance,
                            text=step_data.get("text", ""),
                            order=step_data.get("order", 0),
                        )
                    received_step_ids.add(step.id)

                    # =============================
                    # 4. HANDLE STEP IMAGE DELETION
                    # =============================
                    image_ids = set(step_data.get("image_ids", []))

                    # CHỈ xử lý image nếu step là step CŨ
                    if step_id and step_id in existing_steps:
                        existing_images = {img.id: img for img in step.images.all()}
                        for img_id, img_obj in existing_images.items():
                            if img_id not in image_ids:
                                img_obj.delete()


                # =============================
                # 5. DELETE REMOVED STEPS
                # =============================
                for step_id, step_obj in existing_steps.items():
                    if step_id not in received_step_ids:
                        step_obj.delete()

                # =============================
                # 6. HANDLE NEW STEP IMAGES
                # =============================
                step_images = request.FILES.getlist("step_images")
                step_image_meta = request.data.getlist("step_image_meta")

                for file, meta in zip(step_images, step_image_meta):
                    meta = json.loads(meta)
                    step_id = meta.get("step_id")

                    # Nếu step_id chưa có (mới tạo) thì skip
                    if not step_id:
                        continue

                    try:
                        step = Step.objects.get(id=step_id, recipe=instance)
                        StepImage.objects.create(step=step, image=file)
                    except Step.DoesNotExist:
                        # Step chưa tồn tại: ignore
                        continue

            return instance




            
