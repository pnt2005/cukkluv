import setupCommentMenus from "./comment_menu.js";

export default function loadComments(postId) {
  fetch(`/comments/posts/${postId}/`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('commentsContainer');
      container.innerHTML = data.comments.map(c => `
        <div class="comment-item border-bottom py-2" data-comment-id="${c.id}">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong>${c.user}</strong>
              <small class="text-muted ms-2">${c.created_at}</small>
              <p class="mb-0">${c.content}</p>
            </div>

            ${c.is_owner? `
              <div class="comment-options position-relative">
                <button class="btn btn-link text-muted p-0 text-decoration-none comment-menu-btn">
                  ...
                </button>
                <div class="comment-menu dropdown-menu shadow-sm">
                  <button class="dropdown-item edit-comment-btn">Edit</button>
                  <button class="dropdown-item text-danger delete-comment-btn">Delete</button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('');

      setupCommentMenus(postId);
    });
}
