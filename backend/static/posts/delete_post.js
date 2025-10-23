export default function attachDeleteHandler(postId) {
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.addEventListener('click', () => {
      if (!confirm('Are you sure you want to delete this post?')) return;
      fetch(`/posts/${postId}/delete/`, {
        method: 'POST',
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Đóng modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('postDetailModal'));
          modal.hide();

          // Xoá thẻ bài post khỏi danh sách
          const postCard = document.getElementById(`post-${postId}`)
          if (postCard) {
            postCard.remove();
          }
        }
        else {
          alert('Error deleting post');
        }
      })
      .catch(err => console.error(err));
    });
}