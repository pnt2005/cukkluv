import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import RecipeCard from "./RecipeCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Component cho từng section recipes
const RecipeSection = ({ title, recipes, onRecipeClick }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useState(null)[1];

  const scroll = (direction) => {
    const container = document.getElementById(`scroll-${title}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (recipes.length === 0) return null;

  return (
    <div className="mb-5">
      <h2 className="fw-bold mb-3">{title}</h2>
      <div className="position-relative">
        {/* Nút scroll trái */}
        <button
          onClick={() => scroll('left')}
          className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle shadow opacity-75 hover-opacity-100"
          style={{ zIndex: 10, width: "40px", height: "40px" }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Container các cards */}
        <div 
          id={`scroll-${title}`}
          className="d-flex gap-3 overflow-auto"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {recipes.map((recipe) => (
            <div key={recipe.id} onClick={() => onRecipeClick(recipe.id)}>
              <RecipeCard 
                recipe={recipe} 
                showAuthor={title === "Công thức từ cộng đồng"}
              />
            </div>
          ))}
        </div>

        {/* Nút scroll phải */}
        <button
          onClick={() => scroll('right')}
          className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle shadow opacity-75 hover-opacity-100"
          style={{ zIndex: 10, width: "40px", height: "40px" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        #scroll-${title}::-webkit-scrollbar {
          display: none;
        }
        .hover-opacity-100:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default function RecipePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [cukkluvsRecipes, setCukkluvsRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/auth/user/`, {
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.username || "User");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Token ${token}` })
      };

      // Fetch community recipes
      const communityRes = await fetch(`${API_BASE_URL}/recipes/community/`, { headers });
      if (communityRes.ok) {
        const data = await communityRes.json();
        setCommunityRecipes(data.results || data);
      }

      // Fetch cukkluv's recipes
      const cukkluvRes = await fetch(`${API_BASE_URL}/recipes/cukkluv/`, { headers });
      if (cukkluvRes.ok) {
        const data = await cukkluvRes.json();
        setCukkluvsRecipes(data.results || data);
      }

      // Fetch user's recipes
      if (token) {
        const userRes = await fetch(`${API_BASE_URL}/recipes/my-recipes/`, { headers });
        if (userRes.ok) {
          const data = await userRes.json();
          setUserRecipes(data.results || data);
        }
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/recipes/search/?q=${searchQuery}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCommunityRecipes(data.results || data);
        // Reset other sections khi search
        setCukkluvsRecipes([]);
        setUserRecipes([]);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          {/* Thanh tìm kiếm */}
          <div className="bg-white p-3 rounded shadow-sm mb-4 sticky-top" style={{ top: "60px", zIndex: 100 }}>
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm công thức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-warning text-white d-flex align-items-center gap-2">
                <Search size={18} />
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Các sections recipes */}
          <RecipeSection 
            title="Công thức từ cộng đồng"
            recipes={communityRecipes}
            onRecipeClick={handleRecipeClick}
          />

          <RecipeSection 
            title="Công thức bởi cukkluv"
            recipes={cukkluvsRecipes}
            onRecipeClick={handleRecipeClick}
          />

          {currentUser && (
            <RecipeSection 
              title={`Công thức của ${currentUser}`}
              recipes={userRecipes}
              onRecipeClick={handleRecipeClick}
            />
          )}

          {/* Empty state */}
          {communityRecipes.length === 0 && 
           cukkluvsRecipes.length === 0 && 
           userRecipes.length === 0 && (
            <div className="text-center py-5 text-muted">
              <p>Chưa có công thức nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}