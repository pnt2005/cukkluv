import { useEffect, useState } from "react";
import PostComments from "./PostComments";
import { MessageCircle } from "lucide-react";
import { usePostStore } from "../../store/usePostStore.js";
import EditPostModal from "./EditPostModal.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { timeAgo } from "../../utils/time.js";
import { Heart } from "lucide-react";
import { postsAPI } from "../../utils/api.js";

export default function PostModal({ postId, onClose }) {
  const { posts } = usePostStore();
  const globalPost = posts.find((p) => p.id === postId);
  const [post, setPost] = useState(globalPost);
  const [showEditModal, setShowEditModal] = useState(false);
  const { toggleLike } = usePostStore();

  useEffect(() => {
    if (globalPost) {
      setPost(globalPost);
    }
  }, [globalPost]);

  useEffect(() => {
    async function fetchPost() {
      const res = await postsAPI.getPostDetails(postId);
      setPost(res.json());
    }
    if (!globalPost) {
      fetchPost();
    }
  }, [postId, globalPost]);

  if (!post) return null;

  return (
    <>
      {/* Modal nền */}
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "850px" }}>
          <div className="modal-content" style={{ borderRadius: "10px" }}>
            <div className="d-flex flex-row">
              {/* Ảnh bên trái */}
              <div className="col-6">
                <img
                  src={`${post.image}`}
                  alt="Post"
                  className="img-fluid rounded-start"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Bên phải */}
              <div className="col-6 d-flex flex-column p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <img src={`${API_BASE_URL}${post.author.avatar}`} alt="Avatar" className="rounded-circle me-2" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                    <strong className="fw-bold me-2">{post.author.username}</strong>
                    <div className="text-muted small">
                      {timeAgo(post.created_at)}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {/* Nút sửa chỉ hiện nếu là tác giả */}
                    {post.author.username === localStorage.getItem("username") && (
                      <button
                        className="btn btn-sm"
                        onClick={() => setShowEditModal(true)}
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={onClose}
                    ></button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="mb-0">{post.content}</p>
                </div>
                {/* Tags */}
                {post.tag_objects?.length > 0 && (
                  <div className="mb-3 d-flex flex-wrap gap-2">
                    {post.tag_objects.map((tag) => (
                      <span
                        key={tag.id}
                        className="badge bg-secondary"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="d-flex align-items-center gap-3 mb-2">
                  <button
                    className="btn p-0 d-flex align-items-center text-decoration-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(post.id);
                    }}
                  >
                    <Heart fill={post.user_liked ? "red" : "none"} className="me-1" />
                    {post.like_count}
                  </button>
                  <span>
                    <MessageCircle /> {post.comment_count}
                  </span>
                </div>

                <hr />

                <div className="flex-grow-1 overflow-auto">
                  <PostComments postId={postId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
