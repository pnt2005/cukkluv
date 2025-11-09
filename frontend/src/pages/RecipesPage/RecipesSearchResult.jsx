import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScrollList from '../../components/InfiniteScroll';
import RecipeCard from './RecipesCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RecipeSearchResults({ searchQuery }) {
  const navigate = useNavigate();

  // Hàm fetch search results với pagination
  const fetchSearchPage = async (page) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_BASE_URL}/recipes/search/?q=${searchQuery}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Token ${token}` })
        }
      }
    );
    
    if (!res.ok) {
      throw new Error("Failed to fetch search results");
    }
    
    return res.json(); // Expecting { results: [...], next: "..." }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          {/* Header kết quả tìm kiếm */}
          <div className="mb-3">
            <h5 className="text-muted">
              Kết quả tìm kiếm cho: <span className="fw-bold text-dark">"{searchQuery}"</span>
            </h5>
          </div>

          {/* Infinite scroll list */}
          <InfiniteScrollList
            fetchPage={fetchSearchPage}
            renderItem={(recipe) => (
              <div key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                <RecipeCard 
                  recipe={recipe} 
                  showAuthor={true}
                  layout="horizontal"
                />
              </div>
            )}
            containerStyle={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}