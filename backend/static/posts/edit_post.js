export default function attachEditHandler(postId) {
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