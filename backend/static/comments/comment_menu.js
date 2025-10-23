export default function setupCommentMenus(postId) {
    document.addEventListener('click', function (e) {
        if (e.target.closest('.comment-menu-btn')) {
            const btn = e.target.closest('.comment-menu-btn');
            const menu = btn.nextElementSibling;

            // Đóng tất cả menu khác
            document.querySelectorAll('.comment-menu').forEach(m => {
                if (m !== menu) {
                    m.classList.remove('show');
                }
            });

            // Toggle menu hiện tại
            menu.classList.toggle('show');
            e.stopPropagation();
        } else {
            // Click ngoài menu, đóng tất cả menu
            document.querySelectorAll('.comment-menu').forEach(m => m.classList.remove('show'));
        }
    });

    // Xử lý sự kiện cho nút Sửa
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-comment-btn')) {
            const commentItem = e.target.closest('.comment-item');
            const p = commentItem.querySelector('p');
            const oldContent = p.textContent;
            commentItem.dataset.oldContent = oldContent;
            // thay p bang input
            p.outerHTML = `
                <div class="input-group my-2">
                    <input type="text" class="form-control edit-comment-input" value="${oldContent}">
                    <button class="btn btn-success save-comment-btn">💾</button>
                    <button class="btn btn-secondary cancel-comment-btn">✖️</button>
                </div>
            `;
        }

        // huy edit
        if (e.target.classList.contains('cancel-comment-btn')) {
            const item = e.target.closest('.comment-item');
            const input = item.querySelector('.edit-comment-input');
            input.closest('.input-group').outerHTML = `<p class="mb-0">${item.dataset.oldContent}</p>`;
        }

        // luu edit
        if (e.target.classList.contains('save-comment-btn')) {
            const item = e.target.closest('.comment-item');
            const commentId = item.dataset.commentId;
            const newContent = item.querySelector('.edit-comment-input').value;

            fetch(`/comments/${commentId}/edit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `content=${encodeURIComponent(newContent)}`
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    item.querySelector('.input-group').outerHTML = `<p class="mb-0">${data.content}</p>`;
                }
            });
        }

        // xoa comment
        if (e.target.classList.contains('delete-comment-btn')) {
            const item = e.target.closest('.comment-item');
            const commentId = item.dataset.commentId;

            fetch(`/comments/${commentId}/delete/`, {
                method: 'POST',
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    item.remove();
                }
            });
        }
    });
}