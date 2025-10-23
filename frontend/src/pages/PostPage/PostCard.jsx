import React, { forwardRef } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostCard = forwardRef(({ post, onClick }, ref) => {
  return (
    <div
      ref={ref}
      className="card mb-4 shadow-sm"
      style={{ width: "500px", maxWidth: "100%", cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="d-flex align-items-center mb-2 p-2">
        <div className="fw-bold me-2">{post.author.username}</div>
        <div className="text-muted small">
          {new Date(post.created_at).toLocaleString()}
        </div>
      </div>

      <img
        src={`${API_BASE_URL}/${post.image}`}
        alt="Post"
        className="img-fluid rounded mb-2"
        style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
      />

      <div className="d-flex justify-content-between align-items-center p-2">
        <div>
          ❤️ {post.like_count} &nbsp;&nbsp; 💬 {post.comment_count}
        </div>
      </div>
    </div>
  );
});

export default PostCard;
