from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from posts.models import Post
from interactions.models import Comment
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def add_comment(request, post_id):
    if request.method == 'POST':
        content = request.POST.get('content')
        parent_id = request.POST.get('parent_id')
        post = get_object_or_404(Post, id=post_id)
        parent = Comment.objects.filter(id=parent_id).first() if parent_id else None
        
        comment = Comment.objects.create(
            user=request.user,
            content=content,
            post=post,
            parent=parent
        )

        return JsonResponse({
            'success': True,
            'username': comment.user.username,
            'content': comment.content,
            'created_at': comment.created_at.strftime('%d-%m-%Y %H:%M'),
        })
    return JsonResponse({'success': False})