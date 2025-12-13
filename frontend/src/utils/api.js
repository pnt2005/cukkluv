const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("token");

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const opts = {
    method,
    headers: { ...headers },
  };
  const token = getToken();
  if (token) opts.headers.Authorization = `Token ${token}`;

  //Nếu body là FormData thì không set Content-Type
  if (body instanceof FormData) {
    opts.body = body;
  } else if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}/${path}`, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const err = new Error("API request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: "POST", body });
export const apiPatch = (path, body) => request(path, { method: "PATCH", body });
export const apiDelete = (path) => request(path, { method: "DELETE" });

export const authAPI = {
  login: (username, password) => apiPost(`accounts/login/`, { username, password }),
  register: (userData) => apiPost(`accounts/register/`, userData),
  logout: () => apiPost(`accounts/logout/`),
  getCurrentUser: () => apiGet(`accounts/me/`),
};

export const postsAPI = {
  fetchPosts: (page = 1) => apiGet(`posts/?page=${page}`),
  toggleLike: (postId) => apiPost(`likes/posts/${postId}/`),
  createPost: (formData) => apiPost(`posts/`, formData),
  updatePost: (postId, formData) => apiPatch(`posts/${postId}/`, formData),
  deletePost: (postId) => apiDelete(`posts/${postId}/`),
  getPostDetails: (postId) => apiGet(`posts/${postId}/`),
};

export const commentsAPI = {
  fetchComments: (postId, page = 1) => apiGet(`comments/posts/${postId}/?page=${page}`),
  addComment: (postId, content) => apiPost(`comments/posts/${postId}/`, { content }),
  addReply: (postId, parentId, content) => apiPost(`comments/posts/${postId}/`, { content, parent_id: parentId }),
  toggleLike: (commentId) => apiPost(`likes/comments/${commentId}/`),
  updateComment: (commentId, content) => apiPatch(`comments/${commentId}/`, { content }),
  deleteComment: (commentId) => apiDelete(`comments/${commentId}/`),
};

export const recipesAPI = {
  fetchAllRecipes: () => apiGet(`recipes/`),
  fetchRecipeByID: (id) => apiGet(`recipes/${id}/`),
}