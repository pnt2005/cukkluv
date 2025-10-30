import { create } from "zustand";
import { postsAPI } from "../utils/api.js";

export const usePostStore = create((set, get) => ({
  posts: [],
  hasNext: true,
  page: 1,

  //Lấy danh sách post
  fetchPosts: async (page = 1) => {
    const data = await postsAPI.fetchPosts(page);
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
      await postsAPI.toggleLike(postId);
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