export default function LikeButton({ item, onToggle }) {
  if (!item) return null;

  return (
    <button
      className="btn p-0 d-flex align-items-center text-decoration-none"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(item.id);
      }}
    >
      <Heart fill={item.user_liked ? "red" : "none"} className="me-1" />
      {item.like_count}
    </button>
  );
}
