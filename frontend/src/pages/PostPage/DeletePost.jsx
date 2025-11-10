import { showSuccess, showError } from "../../utils/toast";
import { postsAPI } from "../../utils/api";

export default function DeletePost({ postId }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure to delete this post?")) return;
    try {
        await postsAPI.deletePost(postId);
        if (res.status === 204) {
            showSuccess("Delete post success!");
            window.location.reload();
        } else {
            const data = await res.json();
            showError(data?.detail || "Error deleting post.");
        }
    } catch (err) {
      console.error(err);
      showError("Error: " + (err.data?.detail || err.message));
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-danger"
    >
      Delete
    </button>
  );
}
