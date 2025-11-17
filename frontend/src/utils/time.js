export function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = (now - date) / 1000; // đổi sang giây

  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} tuần trước`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng trước`;

  return `${Math.floor(diff / 31536000)} năm trước`;
}
