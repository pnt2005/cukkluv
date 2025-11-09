import { useState, useEffect } from "react";
import { fetchAllRecipes, categorizeRecipes } from "./RecipeService";

export const useRecipes = (currentUser) => {
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [cukkluvsRecipes, setCukkluvsRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chỉ fetch khi có currentUser
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadRecipes = async () => {
      try {
        setLoading(true);
        const allRecipes = await fetchAllRecipes();
        
        const categorized = categorizeRecipes(allRecipes, currentUser);
        
        setCommunityRecipes(categorized.communityRecipes);
        setCukkluvsRecipes(categorized.cukkluvsRecipes);
        setUserRecipes(categorized.myRecipes);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err.message);
        setCommunityRecipes([]);
        setCukkluvsRecipes([]);
        setUserRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [currentUser]);

  return {
    communityRecipes,
    cukkluvsRecipes,
    userRecipes,
    loading,
    error,
  };
};