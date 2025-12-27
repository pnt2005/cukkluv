import { useEffect, useState } from "react";
import { authAPI } from "../../utils/api.js";
import { useRecipeStore } from "../../store/useRecipesStore";
import { usePostStore } from "../../store/usePostStore";
import { useNavigate } from "react-router-dom";
import PostModal from "../PostPage/PostModal.jsx";
import PostCard from "../PostPage/PostCard.jsx";
import RecipeCard from "../RecipesPage/RecipesCard.jsx";
import { useAuthStore } from "../../store/useAuthStore";
import EditProfileModal from "./EditProfileModal.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const { posts, fetchPosts } = usePostStore();
  const { myRecipes, fetchRecipes, loading: recipeLoading } = useRecipeStore();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      // lấy post page 1 (đủ dùng cho profile)
      fetchPosts(1);
      // lấy recipe từ store
      fetchRecipes();
    };
    fetchData();
  }, []);

  if (!user) return null;
  const myPosts = posts.filter(
    (p) => p.author?.username === user.username
  );

  const onRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div>
        <div className="row">
           {/* ===== LEFT: PROFILE SIDEBAR ===== */}
            <div className="col-md-3">
            <div className="sticky-top" style={{ top: "200px"}}>
                {/* AVATAR */}
                <img
                    src={`${API_BASE_URL}${user.avatar}`}
                    alt="avatar"
                    className="rounded-circle mx-auto d-block"
                    style={{
                        width: 240,
                        height: 240,
                        objectFit: "cover",
                    }}
                />
                {/* INFO */}
                <div className="card-body">
                <h2 className="mb-1">{user.username}</h2>
                <p className="text-muted small mb-3">{user.email}</p>
                {/* EDIT PROFILE */}
                <button
                    className="btn btn-outline-secondary w-100 mb-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editProfileModal"
                >
                    Sửa hồ sơ
                </button>
                {/* LOGOUT */}
                <button
                    className="btn btn-outline-danger w-100"
                    onClick={handleLogout}
                >
                    Đăng xuất
                </button>
                </div>
            </div>
            </div>
            {/* ===== RIGHT: CONTENT ===== */}
            <div className="col-md-9">
            {/* TABS */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === "posts" ? "active" : ""}`}
                    onClick={() => setActiveTab("posts")}
                >
                    Bài đăng ({myPosts.length})
                </button>
                </li>
                <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === "recipes" ? "active" : ""}`}
                    onClick={() => setActiveTab("recipes")}
                >
                    Công thức ({myRecipes.length})
                </button>
                </li>
            </ul>
            {/* POSTS */}
            {activeTab === "posts" && (
                <div className="row">
                {myPosts.map((post) => (
                    <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPostId(post.id)}
                    />
                ))}
                {selectedPostId && (
                    <PostModal
                    postId={selectedPostId}
                    onClose={() => setSelectedPostId(null)}
                    />
                )}
                {myPosts.length === 0 && (
                    <p className="text-muted">Bạn chưa có bài đăng nào.</p>
                )}
                </div>
            )}
            {/* RECIPES */}
            {activeTab === "recipes" && (
                <div className="row">
                {recipeLoading && <p>Đang tải công thức...</p>}
                {myRecipes.map((recipe) => (
                    <div
                    key={recipe.id}
                    className="col-md-4 mb-3"
                    onClick={() => onRecipeClick(recipe.id)}
                    style={{ cursor: "pointer" }}
                    >
                    <RecipeCard recipe={recipe} layout="vertical" />
                    </div>
                ))}
                {!recipeLoading && myRecipes.length === 0 && (
                    <p className="text-muted">Bạn chưa tạo công thức nào.</p>
                )}
                </div>
            )}
            </div>
        </div>
        <EditProfileModal />
    </div>
    );
}

export default ProfilePage;
