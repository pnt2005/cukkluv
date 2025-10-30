import { create } from "zustand";
import { usePostStore } from "./usePostStore.js";
import { commentsAPI } from "../utils/api.js";

export const useCommentStore = create((set, get) => ({
  commentsByPost: {},
  fetchComments: async (postId, page = 1) => {
    const data = await commentsAPI.fetchComments(postId, page);
    set((state) => {
      const prev = state.commentsByPost[postId]?.results || [];
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            results: page === 1 ? data.results : [...prev, ...data.results],
            next: data.next,
            page,
          },
        },
      };
    });
  },

  addComment: async (postId, content) => {
    const newComment = await commentsAPI.addComment(postId, content);
    set((state) => {
      const existing = state.commentsByPost[postId]?.results || [];
      const updatedResults = [newComment, ...existing];
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            ...state.commentsByPost[postId],
            results: updatedResults,
          },
        },
      };
    });
    //Gọi sang usePostStore để tăng comment_count
    const postStore = usePostStore.getState();
    const post = postStore.posts.find((p) => p.id === postId);
    const currentCount = post?.comment_count || 0;
    postStore.updateCommentCount(postId, currentCount + 1);
  },

  addReply: async (postId, parentId, content) => {
    const newReply = await commentsAPI.addReply(postId, parentId, content);

    // helper đệ quy: chèn reply vào đúng comment cha và tăng reply_count
    const insertReply = (items) => {
      return items.map((item) => {
        if (item.id === parentId) {
          const replies = item.replies || [];
          return {
            ...item,
            replies: [newReply, ...replies],
            reply_count: (item.reply_count || 0) + 1,
          };
        }
        if (item.replies && item.replies.length) {
          return { ...item, replies: insertReply(item.replies) };
        }
        return item;
      });
    };

    set((state) => {
      const postComments = state.commentsByPost[postId];
      if (!postComments) return state; // nếu chưa load comments thì không làm gì
      const updatedResults = insertReply(postComments.results || []);
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            ...postComments,
            results: updatedResults,
          },
        },
      };
    });
    //Gọi sang usePostStore để tăng comment_count
    const postStore = usePostStore.getState();
    const post = postStore.posts.find((p) => p.id === postId);
    const currentCount = post?.comment_count || 0;
    postStore.updateCommentCount(postId, currentCount + 1);
  },
}));