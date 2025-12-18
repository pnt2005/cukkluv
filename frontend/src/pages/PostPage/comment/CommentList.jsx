import CommentItem from "./CommentItem.jsx";

export default function CommentList({ postId, items }) {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "5px",
        backgroundColor: "#f8f9fa",
      }}
    >
      {items.length === 0 && (
        <div className="text-center text-muted my-3">
          Chưa có bình luận nào
        </div>
      )}

      {items.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          postId={postId}
        />
      ))}
    </div>
  );
}
