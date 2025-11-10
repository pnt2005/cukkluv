import { useEffect, useState } from "react";
import { postsAPI } from "../../utils/api";
import { Delete } from "lucide-react";
import DeletePost from "./DeletePost";

export default function EditPostModal({ post, onClose }) {
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setPreview(post.image || null);
    }
  }, [post]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await postsAPI.updatePost(post.id, formData);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Error: " + (err.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      aria-labelledby="editPostModalLabel"
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-2">
          <div className="modal-header">
            <h5 className="modal-title text-primary fw-bold" id="editPostModalLabel">
              Edit Post
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex gap-3">
              {/* Khung ảnh */}
              <div
                className="flex-shrink-0 d-flex align-items-center justify-content-center bg-light rounded"
                style={{ width: "50%", minHeight: "250px" }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{
                      height: "380px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                ) : (
                  <div className="text-muted small">No image selected</div>
                )}
              </div>

              {/* Khung nội dung */}
              <div className="flex-grow-1">
                <div className="mb-2">
                  <label className="form-label fw-semibold">Change Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Content</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>

                {error && <div className="text-danger small">{error}</div>}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <DeletePost postId={post.id}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
