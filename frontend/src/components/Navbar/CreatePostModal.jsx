import { useState } from "react";
import { postsAPI } from "../../utils/api";

export default function CreatePostModal() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);
    formData.append("tags", tags);

    try {
      await postsAPI.createPost(formData);
      setContent("");
      setImage(null);
      setPreview(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Error: " + (err.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="modal fade"
      id="createPostModal"
      tabIndex="-1"
      aria-labelledby="createPostModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-2">
          <div className="modal-header">
            <h5 className="modal-title text-warning fw-bold" id="createPostModalLabel">
              Create New Post
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex gap-3">
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

              <div className="flex-grow-1">
                <div className="mb-2">
                  <label className="form-label fw-semibold">Image</label>
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

                <div className="mb-3">
                  <label className="form-label fw-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: food,travel,fun"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                {error && <div className="text-danger small">{error}</div>}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-warning text-white"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
