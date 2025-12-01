// Thêm reply vào nested comments
export const insertReply = (items, parentId, newReply) =>
  items.map((item) => {
    if (item.id === parentId) {
      const replies = item.replies || [];
      return {
        ...item,
        replies: [newReply, ...replies],
        reply_count: (item.reply_count || 0) + 1,
      };
    }
    if (item.replies?.length) {
      return { ...item, replies: insertReply(item.replies, parentId, newReply) };
    }
    return item;
  });

// Cập nhật nội dung comment
export const updateCommentContent = (items, commentId, newContent) =>
  items.map((item) => {
    if (item.id === commentId) return { ...item, content: newContent };
    if (item.replies?.length)
      return { ...item, replies: updateCommentContent(item.replies, commentId, newContent) };
    return item;
  });

// Toggle like local state
export const updateLocalLike = (items, commentId) =>
  items.map((item) => {
    if (item.id === commentId) {
      const newLiked = !item.user_liked;
      const newCount = item.like_count + (newLiked ? 1 : -1);
      return {
        ...item,
        user_liked: newLiked,
        like_count: newCount,
      };
    }
    if (item.replies?.length) {
      return { ...item, replies: updateLocalLike(item.replies, commentId) };
    }
    return item;
  });
