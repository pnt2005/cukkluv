import { showSuccess, showError } from "../../utils/toast";
import { postsAPI } from "../../utils/api";

export default function DeletePost({ postId }) {
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
        await postsAPI.deletePost(postId);
        if (res.status === 204) {
            showSuccess("Xóa bài viết thành công.");
            window.location.reload();
        } else {
            const data = await res.json();
            showError(data?.detail || "Lỗi xóa bài viết.");
        }
    } catch (err) {
      console.error(err);
      showError("Lỗi: " + (err.data?.detail || err.message));
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-danger"
    >
      Xóa
    </button>
  );
}
