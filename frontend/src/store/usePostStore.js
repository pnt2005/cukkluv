// src/store/usePostStore.js
import { create } from "zustand";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

export const usePostStore = create((set, get) => ({
  posts: [],
  hasNext: true,
  page: 1,

  //Lấy danh sách post
  fetchPosts: async (page = 1) => {
    const res = await fetch(`${API_BASE_URL}/posts/?page=${page}`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const data = await res.json();

    set((state) => ({
      posts: page === 1 ? data.results : [...state.posts, ...data.results],
      hasNext: Boolean(data.next),
      page,
    }));
  },

  //Cập nhật like (đồng bộ toàn app)
  toggleLike: async (postId) => {
    const post = get().posts.find((p) => p.id === postId);
    if (!post) return;

    const newLiked = !post.user_liked;
    const newCount = post.like_count + (newLiked ? 1 : -1);

    //cập nhật local ngay
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, like_count: newCount, user_liked: newLiked } : p
      ),
    }));

    //gọi API thật
    try {
      const res = await fetch(`${API_BASE_URL}/likes/posts/${postId}/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to toggle like");
    } catch (err) {
      // rollback nếu API lỗi
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, like_count: post.like_count, user_liked: post.user_liked } : p
        ),
      }));
    }
  },

  //Cập nhật số lượng comment
  updateCommentCount: (postId, newCount) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comment_count: newCount } : p
      ),
    })),
}));
