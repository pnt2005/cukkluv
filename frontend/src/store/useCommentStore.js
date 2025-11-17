import { create } from "zustand";
import { usePostStore } from "./usePostStore.js";
import { commentsAPI } from "../utils/api.js";
import { insertReply, updateCommentContent, updateLocalLike } from "../utils/reply.js";

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
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            ...state.commentsByPost[postId],
            results: [newComment, ...existing],
          },
        },
      };
    });

    const postStore = usePostStore.getState();
    const post = postStore.posts.find((p) => p.id === postId);
    postStore.updateCommentCount(postId, (post?.comment_count || 0) + 1);
  },

  addReply: async (postId, parentId, content) => {
    const newReply = await commentsAPI.addReply(postId, parentId, content);
    set((state) => {
      const postComments = state.commentsByPost[postId];
      if (!postComments) return state;
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: {
            ...postComments,
            results: insertReply(postComments.results, parentId, newReply),
          },
        },
      };
    });

    const postStore = usePostStore.getState();
    const post = postStore.posts.find((p) => p.id === postId);
    postStore.updateCommentCount(postId, (post?.comment_count || 0) + 1);
  },

  editComment: async (commentId, content) => {
    const updatedComment = await commentsAPI.updateComment(commentId, content);
    set((state) => {
      const newCommentsByPost = {};
      for (const [postId, postData] of Object.entries(state.commentsByPost)) {
        newCommentsByPost[postId] = {
          ...postData,
          results: updateCommentContent(postData.results, commentId, updatedComment.content),
        };
      }
      return { commentsByPost: newCommentsByPost };
    });
  },

  toggleLike: async (commentId, postId) => {
    const { commentsByPost } = get();
    const postComments = commentsByPost[postId];
    if (!postComments) return;
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: {
          ...postComments,
          results: updateLocalLike(postComments.results, commentId),
        },
      },
    }));
    try {
      await commentsAPI.toggleLike(commentId);
    } catch (err) {
      console.error("Toggle like failed:", err);
    }
  },
}));
