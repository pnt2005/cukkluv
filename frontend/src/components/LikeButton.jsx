// src/components/LikeButton.jsx
import { Heart } from "lucide-react";
import { usePostStore } from "../store/usePostStore.js";

export default function LikeButton({ postId }) {
  const { posts, toggleLike } = usePostStore();
  const post = posts.find((p) => p.id === postId);

  if (!post) return null;

  return (
    <button
      className="btn p-0 d-flex align-items-center text-decoration-none"
      onClick={(e) => {
        e.stopPropagation(); // tránh click đè mở modal
        toggleLike(postId);
      }}
    >
      <Heart
        fill={post.user_liked ? "red" : "none"}
        className="me-1"
      />
      {post.like_count}
    </button>
  );
}
