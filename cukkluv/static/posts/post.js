// xem chi tiet bai post
function openPostDetail(postId) {
    fetch(`/posts/${postId}/`)
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text(); // server trả về HTML partial
    })
    .then(html => {
        document.getElementById("postDetailContent").innerHTML = html;
        const modal = new bootstrap.Modal(document.getElementById("postDetailModal"));
        modal.show();
        // Xử lý nút xóa bài post
        attachDeleteHandler(postId);
        attachEditHandler(postId);
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
}

// Xử lý nút xóa bài post
function attachDeleteHandler(postId) {
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

// Xử lý nút chỉnh sửa bài post
function attachEditHandler(postId) {
    const editBtn = document.getElementById('editBtn');
    const viewMode = document.getElementById('viewMode');
    const editForm = document.getElementById('editForm');
    const cancelEdit = document.getElementById('cancelEdit');

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        viewMode.style.display = 'none';
        editForm.style.display = 'block';
      });
    }

    if (cancelEdit) {
      cancelEdit.addEventListener('click', () => {
        editForm.style.display = 'none';
        viewMode.style.display = 'block';
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);

        const response = await fetch(`/posts/${postId}/update/`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          document.getElementById('postContent').textContent = data.content;
          if (data.image_url) {
            document.querySelector('#viewMode img').src = data.image_url;
            document.getElementById(`post-${postId}`).querySelector('img').src = data.image_url;
          }
          cancelEdit.click();
          alert('Update successed!');
        } else {
          alert('Update failed');
        }
      });
    }
}