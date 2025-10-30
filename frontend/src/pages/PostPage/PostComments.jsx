import { useEffect, useRef } from "react";
import { useCommentStore } from "../../store/useCommentStore.js";
import CommentList from "./components/CommentList.jsx";

export default function PostComments({ postId }) {
  const commentInputRef = useRef();
  const { commentsByPost, fetchComments, addComment } = useCommentStore();
  const commentsData = commentsByPost[postId] || { results: [], next: null, page: 0 };

  useEffect(() => {
    fetchComments(postId, 1);
  }, [postId, fetchComments]);

  const handleSendComment = async () => {
    const content = commentInputRef.current.value.trim();
    if (!content) return;
    try {
      await addComment(postId, content);
      commentInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadMore = () => {
    if (commentsData.next) {
      fetchComments(postId, commentsData.page + 1);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 mb-3" style={{ height: "300px" }}>
        <CommentList postId={postId} items={commentsData.results} onLoadMore={handleLoadMore} />
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