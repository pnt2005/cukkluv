from django import forms
from .models import Recipe

class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ['title', 'description', 'ingredients', 'steps', 'image', 'tags']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter recipe title',
                'maxlength': 200
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Describe your recipe...',
                'rows': 3
                }),
            'ingredients': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'List ingredients...',
                'rows': 6 
                }),
            'steps': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Describe the cooking steps...',
                'rows': 8
                }),
            'image': forms.ClearableFileInput(attrs={
                'class': 'form-control-file',
                'accept': 'image/*'
                }),
            'tags': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Add tags',
                'maxlength': 200
                })
        }
    
    def clean_title(self):
        title = self.cleaned_data.get('title')
        if title and len(title) < 5:
            raise forms.ValidationError('Title must be at least 5 characters long.')
        return title
    
    def clean_image(self):
        image = self.cleaned_data.get('image')
        if image:
            if image.size > 5 * 1024 * 1024:
                raise forms.ValidationError('Image file size may not exceed 5MB.')
        return image
    