import { useRef, useState } from "react";
import InfiniteScroll from "../../components/InfiniteScroll.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostComments({ postId }) {
  const commentInputRef = useRef();
  const [commentListKey, setCommentListKey] = useState(0);

  // fetch comments phân trang
  const fetchCommentsPage = async (page) => {
    const res = await fetch(`${API_BASE_URL}/comments/posts/${postId}/?page=${page}`);
    return res.json(); // {results, next, previous, count}
  };

  // gửi comment
  const handleSendComment = async () => {
    const content = commentInputRef.current.value.trim();
    if (!content) return;

    try {
      const res = await fetch(`${API_BASE_URL}/comments/posts/${postId}/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send comment");

      commentInputRef.current.value = "";
      setCommentListKey((prev) => prev + 1); // reload comment list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 mb-3" style={{ height: "300px" }}>
        <InfiniteScroll
          key={commentListKey}
          fetchPage={fetchCommentsPage}
          renderItem={(c) => (
            <div key={c.id} className="mb-2">
              <b>{c.user.username}</b>: {c.content}
            </div>
          )}
          containerStyle={{
            height: "100%",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "5px",
            backgroundColor: "#f8f9fa",
          }}
        />
      </div>

      <div className="d-flex gap-2">
        <input
          ref={commentInputRef}
          type="text"
          className="form-control"
          placeholder="Write a comment..."
          onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
        />
        <button className="btn btn-primary" onClick={handleSendComment}>
          Send
        </button>
      </div>
    </div>
  );
}
