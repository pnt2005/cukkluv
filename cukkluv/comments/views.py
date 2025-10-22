from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from posts.models import Post
from .models import Comment
from django.views.decorators.csrf import csrf_exempt

def get_comments(request, post_id):
    comments = Comment.objects.filter(post_id=post_id).select_related('user').order_by('-created_at')
    data = [
        {
            'id': c.id,
            'user': c.user.username,
            'content': c.content,
            'created_at': c.created_at.strftime('%d-%m-%Y %H:%M'),
            'is_owner': c.user == request.user
        }
        for c in comments
    ]
    return JsonResponse({'comments': data})


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


@csrf_exempt
def edit_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    if request.method == 'POST':
        comment.content = request.POST.get('content')
        comment.save()
        return JsonResponse({'success': True, 'content': comment.content})
    return JsonResponse({'success': False})
    

@csrf_exempt
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, user=request.user)
    if request.method == 'POST':
        comment.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})
