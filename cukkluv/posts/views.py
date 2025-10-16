from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from posts.models import Post
from posts.forms import PostForm
from django.views.decorators.csrf import csrf_exempt

@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('post_list')
    else:
        form = PostForm()
        return render(request, 'posts/create_post.html', {'form': form})
    

def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    return render(request, 'posts/post_list.html', {'posts': posts})


def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    comments = post.comments.all().order_by('-created_at')
    return render(request, 'posts/post_detail.html', {
        'post': post,
        'comments': comments
    })


@csrf_exempt
def post_delete(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        post.delete()
        return JsonResponse({'success': True}, content_type='application/json')
    return JsonResponse({'success': False}, content_type='application/json', status=400)


@csrf_exempt
def update_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            return JsonResponse({
                'success': True,
                'content': post.content,
                'image_url': post.image.url if post.image else ''
            }, content_type='application/json')
    return JsonResponse({'success': False}, content_type='application/json', status=400)