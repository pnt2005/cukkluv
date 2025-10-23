import loadComments from "./comment_list.js";

export default function setupCommentForm(postId) {
    const form = document.getElementById('commentForm');
    const input = document.getElementById('commentInput');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const content = input.value.trim();
        if (!content) return;

        fetch(`/comments/posts/${postId}/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `content=${encodeURIComponent(content)}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                input.value = '';
                loadComments(postId);
            }
        });
    });
}