import attachEditHandler from './edit_post.js';
import attachDeleteHandler from './delete_post.js';

export default function openPostDetail(postId) {
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

window.openPostDetail = openPostDetail;