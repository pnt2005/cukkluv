import { useEffect, useState } from "react";
import PostComments from "./PostComments";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostModal({ postId, onClose }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    setLoadingPost(true);
    fetch(`${API_BASE_URL}/posts/${postId}/`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoadingPost(false);
      })
      .catch(() => setLoadingPost(false));
  }, [postId]);

  if (!post) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: "10px" }}>
          <div className="d-flex flex-row">
            {/* Ảnh bên trái */}
            <div className="col-7">
              <img
                src={`${API_BASE_URL}/${post.image}`}
                alt="Post"
                className="img-fluid rounded-start"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Comment bên phải */}
            <div className="col-5 d-flex flex-column p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong>{post.author.username}</strong>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>

              <PostComments postId={postId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
