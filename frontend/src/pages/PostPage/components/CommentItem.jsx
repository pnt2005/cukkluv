import { useState } from "react";
import ReplyInput from "./ReplyInput.jsx";
import { useCommentStore } from "../../../store/useCommentStore.js";

export default function CommentItem({ comment, postId, depth = 0 }) {
  const [openReply, setOpenReply] = useState(false);
  const { addReply } = useCommentStore();

  const handleSendReply = async (content) => {
    if (!content) return;
    try {
      await addReply(postId, comment.id, content);
      setOpenReply(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginLeft: depth * 18 }} className="mb-2">
      <div>
        <b>{comment.user?.username}</b>: {comment.content}
      </div>

      <div className="d-flex align-items-center gap-2 mt-1 mb-2">
        <small className="text-muted">{comment.replies.length || 0} replies</small>
        <button className="btn btn-sm btn-link" onClick={() => setOpenReply((s) => !s)}>
          Reply
        </button>
      </div>

      {openReply && <ReplyInput onSend={handleSendReply} onCancel={() => setOpenReply(false)} />}

      {(comment.replies || []).map((r) => (
        <CommentItem key={r.id} comment={r} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}