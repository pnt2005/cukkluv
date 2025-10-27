import { useEffect, useState } from "react";
import PostComments from "./PostComments";
import LikeButton from "../../components/LikeButton.jsx";
import { MessageCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostModal({ postId, onClose }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    setLoadingPost(true);
    fetch(`${API_BASE_URL}/posts/${postId}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setTotalLikes(data.like_count || 0);
        setUserLiked(data.user_liked || false);
        setLoadingPost(false);
      })
      .catch(() => setLoadingPost(false));
  }, [postId]);

  if (!post) return null;

  return (
    <>
    <div className="modal-backdrop fade show"></div>
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
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
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong>{post.author.username}</strong>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>

              {/* Nội dung bài viết */}
              <div className="mb-3">
                <p className="mb-0">{post.content}</p>
              </div>

              {/* Like + Thông tin */}
              <div className="d-flex align-items-center gap-3 mb-2">
                <LikeButton
                  postId={post.id}
                  initialLikeCount={totalLikes}
                  initiallyLiked={userLiked}
                />
                <span>{post.comment_count} <MessageCircle /></span>
              </div>

              <hr />

              {/* Comment */}
              <div className="flex-grow-1 overflow-auto">
                <PostComments postId={postId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
