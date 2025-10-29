import { create } from "zustand";
import { usePostStore } from "./usePostStore.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCommentStore = create((set, get) => ({
  commentsByPost: {},

  fetchComments: async (postId, page = 1) => {
    const res = await fetch(`${API_BASE_URL}/comments/posts/${postId}/?page=${page}`);
    const data = await res.json();
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
    const res = await fetch(`${API_BASE_URL}/comments/posts/${postId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to add comment");
    const newComment = await res.json();

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
}));
