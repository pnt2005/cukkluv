import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useRecipeStore } from "../../store/useRecipesStore";
import SearchBar from "../../components/SearchBar";
import RecipeSection from "./RecipesSection";

export default function RecipesPage() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const [searchQuery, setSearchQuery] = useState("");

  const { communityRecipes, cukkluvRecipes, myRecipes, fetchRecipes, loading } =
    useRecipeStore();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  if (loading) {
    return (
      <div className="container mt-4" >
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải công thức...</p>
        </div>
      </div>
    );
  }

  const isSearching = searchQuery.trim() !== "";

  const filteredCommunity = communityRecipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCukkluv = cukkluvRecipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyRecipes = myRecipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="mb-4">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>

          <RecipeSection
            title="CÔNG THỨC CỘNG ĐỒNG"
            recipes={isSearching ? filteredCommunity : communityRecipes}
            onRecipeClick={handleRecipeClick}
          />

          <RecipeSection
            title="CÔNG THỨC TỪ CUKKLUV"
            recipes={isSearching ? filteredCukkluv : cukkluvRecipes}
            onRecipeClick={handleRecipeClick}
          />

          {username && (
            <RecipeSection
              title={`CÔNG THỨC CỦA ${username.toUpperCase()}`}
              recipes={isSearching ? filteredMyRecipes : myRecipes}
              onRecipeClick={handleRecipeClick}
            />
          )}

          {/* empty */}
          {communityRecipes.length === 0 &&
            cukkluvRecipes.length === 0 &&
            myRecipes.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p>Chưa có công thức nào</p>
              </div>
            )}

          {isSearching &&
            filteredCommunity.length === 0 &&
            filteredCukkluv.length === 0 &&
            filteredMyRecipes.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p>Không tìm thấy công thức nào</p>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}
