// LikeButton.jsx
import React, { useEffect, useState } from "react";
import { showError } from "../utils/toast.js";
import { Heart } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LikeButton({ postId, initialLikeCount, initiallyLiked }) {
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [liked, setLiked] = useState(initiallyLiked || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikeCount(initialLikeCount);
    setLiked(initiallyLiked);
  }, [initialLikeCount, initiallyLiked]);

  const handleLike = async (e) => {
    e.stopPropagation(); // để không trigger click trên PostCard
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/likes/posts/${postId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        }
      });

      if (!res.ok) throw new Error("Failed to like post");

      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
      showError("Error liking post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`btn btn-sm ${liked ? "btn-danger" : "btn-outline-danger"}`}
      disabled={loading}
    >
      <Heart /> {likeCount}
    </button>
  );
}
