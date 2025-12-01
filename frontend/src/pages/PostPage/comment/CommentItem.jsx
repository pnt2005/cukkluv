import { useState } from "react";
import ReplyInput from "./ReplyInput.jsx";
import EditCommentForm from "./EditComment.jsx";
import { useCommentStore } from "../../../store/useCommentStore.js";
import { timeAgo } from "../../../utils/time.js";
import { MessageCircleReply, PencilIcon } from "lucide-react";
import { Heart } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CommentItem({ comment, postId, depth = 0 }) {
  const [openReply, setOpenReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const { addReply, editComment, toggleLike } = useCommentStore();
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
    <div style={{ marginLeft: depth * 18 }} className="mb-3">
      <div className="d-flex">
        <img
          src={`${API_BASE_URL}${comment.user.avatar}`}
          className="rounded-circle me-2"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover"
          }}
        />
        <div style={{ flex: 1 }}>
          <div className="d-flex align-items-start">
            <div className="d-flex align-items-start gap-2" style={{ flex: 1 }}>
              <b>{comment.user.username}</b>
              <div style={{ whiteSpace: "pre-wrap" }}>
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
              <button
                className="btn p-0 d-flex align-items-center ms-auto"
                onClick={() => toggleLike(comment.id, postId)}
                style={{ marginLeft: "12px" }}
              >
                <Heart
                  size={16}
                  fill={comment.user_liked ? "red" : "none"}
                  className="me-1"
                />
                {comment.like_count}
              </button>
            )}
          </div>
          {!editing && (
            <div className="d-flex align-items-center mt-1 gap-3">
              <span className="text-muted small">{timeAgo(comment.created_at)}</span>
              <button
                className="btn p-0"
                onClick={() => setOpenReply((s) => !s)}
              >
                <MessageCircleReply size={18} />
              </button>
              {comment.user.username === localStorage.getItem("username") && (
                <button
                  className="btn p-0"
                  onClick={() => setEditing(true)}
                >
                  <PencilIcon size={18} />
                </button>
              )}
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
      </div>
    </div>
  );
}
