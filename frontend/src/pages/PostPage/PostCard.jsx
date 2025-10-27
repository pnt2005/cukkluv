import React, { forwardRef } from "react";
import { useEffect, useState } from "react";
import LikeButton from "../../components/LikeButton.jsx";
import { MessageCircle } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostCard = forwardRef(({ post, onClick }, ref) => {
  const [totalLikes, setTotalLikes] = useState();
  const [userLiked, setUserLiked] = useState();
  const [loadingLikes, setLoadingLikes] = useState(true);

  const fetchPostLike = async (signal) => {
    const res = await fetch(`${API_BASE_URL}/likes/posts/${post.id}/`, { 
      signal,
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch likes");
    return res.json(); // expect { total_likes, user_liked } or similar
  };

  useEffect(() => {
    const ac = new AbortController();
    setLoadingLikes(true);
    fetchPostLike(ac.signal)
      .then((data) => {
        // adjust fields names if your API uses different keys
        setTotalLikes(data.total_likes);
        setUserLiked(data.user_liked);
      })
      .catch(() => {
        // keep fallback values from post prop on error
      })
      .finally(() => setLoadingLikes(false));
    return () => ac.abort();
  }, [post.id]);

  return (
    <div
      ref={ref}
      className="card mb-4 shadow-sm mx-auto"
      style={{ maxWidth: "500px", maxWidth: "100%", cursor: "pointer" }}
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
        <LikeButton
          postId={post.id}
          initialLikeCount={totalLikes}
          initiallyLiked={userLiked} // server trả về thông tin user đã like chưa
        />
        <div>
          <MessageCircle/> {post.comment_count}
        </div>
      </div>
    </div>
  );
});

export default PostCard;
