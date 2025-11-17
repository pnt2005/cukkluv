import LikeButton from "../../components/LikeButton.jsx";
import { MessageCircle } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { timeAgo } from "../../utils/time.js";

export default function PostCard({ post, onClick }) {
  return (
    <div
      className="card mb-4 shadow-sm mx-auto"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="d-flex align-items-center mb-2 p-2">
        <img src={`${API_BASE_URL}${post.author.avatar}`} alt="Avatar" className="rounded-circle me-2" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
        <div className="fw-bold me-2">{post.author.username}</div>
        <div className="text-muted small">
          {timeAgo(post.created_at)}
        </div>
      </div>
      <img
        src={`${post.image}`}
        alt="Post"
        className="img-fluid rounded mb-2"
        style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
      />
      <div className="d-flex align-items-center gap-3 p-2">
        <LikeButton
          postId={post.id}
        />
        <div>
          <MessageCircle /> {post.comment_count}
        </div>
      </div>
    </div>
  );
}
