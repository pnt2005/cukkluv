import { MessageCircle } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { timeAgo } from "../../utils/time.js";
import { usePostStore } from "../../store/usePostStore.js";
import { Heart } from "lucide-react";

export default function PostCard({ post, onClick }) {
  const { toggleLike } = usePostStore();
  return (
    <div
      className="card mb-4 shadow-sm mx-auto"
      style={{ cursor: "pointer", maxWidth: "600px", borderRadius: "20px", border: "1px solid #eee" }}
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
        style={{ width: "100%",
                height: "460px",      // dài hơn
                objectFit: "contain",
                backgroundColor: "#f8f9fa",
                borderRadius: "18px"  
              }}
      />
      <div className="d-flex align-items-center gap-3 p-2">
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
        <div>
          <MessageCircle /> {post.comment_count}
        </div>
      </div>
    </div>
  );
}
