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

export const authAPI = {
  login: (username, password) =>
    apiPost(`accounts/login/`, { username, password }),
  register: (userData) => apiPost(`accounts/register/`, userData),
  logout: () => apiPost(`accounts/logout/`),
};

export const postsAPI = {
  fetchPosts: (page = 1) => apiGet(`posts/?page=${page}`),
  toggleLike: (postId) => apiPost(`likes/posts/${postId}/`),
  createPost: (formData) => apiPost(`posts/`, formData),
};

export const commentsAPI = {
  fetchComments: (postId, page = 1) => apiGet(`comments/posts/${postId}/?page=${page}`),
  addComment: (postId, content) => apiPost(`comments/posts/${postId}/`, { content }),
  addReply: (postId, parentId, content) =>
    apiPost(`comments/posts/${postId}/`, { content, parent_id: parentId }),
};
