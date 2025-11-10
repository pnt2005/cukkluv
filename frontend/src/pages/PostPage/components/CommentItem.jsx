import { useState } from "react";
import ReplyInput from "./ReplyInput.jsx";
import EditCommentForm from "./EditComment.jsx";
import { useCommentStore } from "../../../store/useCommentStore.js";

export default function CommentItem({ comment, postId, depth = 0 }) {
  const [openReply, setOpenReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const { addReply, editComment } = useCommentStore();

  const handleSendReply = async (content) => {
    if (!content) return;
    try {
      await addReply(postId, comment.id, content);
      setOpenReply(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (newContent) => {
    if (!newContent) return;
    try {
      await editComment(comment.id, newContent);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginLeft: depth * 18 }} className="mb-2">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <b>{comment.user?.username}</b>:{" "}
          {editing ? (
            <EditCommentForm
              initialValue={comment.content}
              onSave={handleEdit}
              onCancel={() => setEditing(false)}
            />
          ) : (
            comment.content
          )}
        </div>
      </div>

      {!editing && (
        <div className="d-flex align-items-center gap-2 mt-1 mb-2">
          <small className="text-muted">{comment.replies.length || 0} replies</small>
          <button
            className="btn btn-sm btn-link"
            onClick={() => setOpenReply((s) => !s)}
          >
            Reply
          </button>
          <button
            className="btn btn-sm btn-link text-primary"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}

      {openReply && (
        <ReplyInput
          onSend={handleSendReply}
          onCancel={() => setOpenReply(false)}
        />
      )}

      {(comment.replies || []).map((r) => (
        <CommentItem
          key={r.id}
          comment={r}
          postId={postId}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
