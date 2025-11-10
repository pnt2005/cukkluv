const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: Lấy headers với token
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Token ${token}` }),
  };
};

// Lấy thông tin user hiện tại
export const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/accounts/me/`, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await response.json();
  return data.username || "";
};

// Lấy tất cả recipes
export const fetchAllRecipes = async () => {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.results || data || [];
};

// Phân loại recipes theo username
export const categorizeRecipes = (allRecipes, currentUser) => {
  const cukkluvsRecipes = allRecipes.filter(
    (recipe) => recipe.author?.username === "admin"
  );

  const myRecipes = currentUser
    ? allRecipes.filter((recipe) => recipe.author?.username === currentUser)
    : [];

  const communityRecipes = allRecipes.filter((recipe) => {
    const username = recipe.author?.username;
    return username && username !== "admin" && username !== currentUser;
  });

  return {
    communityRecipes,
    cukkluvsRecipes,
    myRecipes,
  };
};