import { useEffect, useState } from "react";
import PostComments from "./PostComments";
import LikeButton from "../../components/LikeButton.jsx";
import { MessageCircle } from "lucide-react";
import { usePostStore } from "../../store/usePostStore.js";
import EditPostModal from "./EditPostModal.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostModal({ postId, onClose }) {
  const { posts } = usePostStore();
  const globalPost = posts.find((p) => p.id === postId);
  const [post, setPost] = useState(globalPost);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (globalPost) {
      setPost(globalPost);
    }
  }, [globalPost]);

  useEffect(() => {
    if (!globalPost) {
      fetch(`${API_BASE_URL}/posts/${postId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
        });
    }
  }, [postId, globalPost]);

  if (!post) return null;

  return (
    <>
      {/* Modal nền */}
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "10px" }}>
            <div className="d-flex flex-row">
              {/* Ảnh bên trái */}
              <div className="col-7">
                <img
                  src={`${post.image}`}
                  alt="Post"
                  className="img-fluid rounded-start"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Bên phải */}
              <div className="col-5 d-flex flex-column p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong>{post.author.username}</strong>

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

                <div className="d-flex align-items-center gap-3 mb-2">
                  <LikeButton postId={post.id} />
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
