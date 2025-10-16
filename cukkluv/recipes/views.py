from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from .models import Recipe
from .forms import RecipeForm

# Create your views here.
@login_required
def create_recipe(request):
    if request.method == 'POST': # check có phải submit form hay ko
        form = RecipeForm(request.POST, request.FILES) # khởi tạo form từ dữ liệu người dùng gửi lên request.post là text, request.file là file đính kèm, trong trường hợp này là image
        if form.is_valid(): # kiểm tra form có hợp lệ từng với các ràng buộc trong forms.py ko
            Recipe = form.save(commit=False) # Recipe ở đây là class Recipe thuộc models.py thuộc database; khởi tạo Recipe từ form nhưng commit = false để ch lưu vội vào database, chờ thêm tác giả
            Recipe.author = request.user # gán tác giả là user hiện tại
            Recipe.save() # lưu vào database
            form.save_m2m()  # Save tags ---??--
            return redirect('recipe_list') # chuyển hướng về trang danh sách bài viết
    else:
        form = RecipeForm() # khởi tạo form rỗng
        return render(request, 'recipes/create_recipe.html', {'form': form}) # render trang tạo bài viết, truyền form rỗng vào context để hiển thị
    
def recipe_list(request): #khởi tạo trang hiển thị danh sách recipe
    recipes = Recipe.objects.all().order_by('-created_at') # lấy tất cả recipe trong database, sắp xếp theo thời gian tạo mới nhất
    return render(request, 'recipes/recipe_list.html', {'recipes': recipes})

def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    return render(request, 'recipes/partials/recipe_detail.html', {'recipe': recipe})

@login_required
def recipe_delete(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    if request.method == 'POST':
        recipe.delete()
        return JsonResponse({'success': True}, content_type='application/json')
    return JsonResponse({'success': False}, content_type='application/json', status=400)