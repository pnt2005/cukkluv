import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useRecipes } from "../../store/useRecipes";
import SearchBar from "../../components/SearchBar";
import RecipeSearchResults from "./RecipesSearchResult";
import RecipeSection from "./RecipesSection";

export default function RecipesPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { currentUser, loading: userLoading } = useCurrentUser();
  const {
    communityRecipes,
    cukkluvsRecipes,
    userRecipes,
    loading: recipesLoading,
  } = useRecipes(currentUser);

  const handleSearch = (query) => {
    if (query.trim()) setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const loading = userLoading || recipesLoading;

  // Hiển thị loading
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải công thức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          {/* Thanh tìm kiếm */}
          <div className="bg-white p-3 rounded shadow-sm mb-4">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Tìm kiếm công thức..."
            />
          </div>

          {/* Hiển thị kết quả tìm kiếm hoặc sections */}
          {isSearching ? (
            <RecipeSearchResults searchQuery={searchQuery} />
          ) : (
            <>
              <RecipeSection
                title="CÔNG THỨC CỦA CỘNG ĐỒNG"
                recipes={communityRecipes}
                onRecipeClick={handleRecipeClick}
              />

              <RecipeSection
                title="CÔNG THỨC CỦA CUKKLUV"
                recipes={cukkluvsRecipes}
                onRecipeClick={handleRecipeClick}
              />

              {currentUser && (
                <RecipeSection
                  title={`CÔNG THỨC CỦA ${currentUser.toUpperCase()}`}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
