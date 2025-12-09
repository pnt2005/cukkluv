import { create } from 'zustand';
import { recipesAPI } from "../utils/api.js"

const categorizeRecipes = (allRecipes, currentUser) => {
  const cukkluvRecipes = allRecipes.filter(
    (recipe) => recipe.author?.username === "admin"
  );

  const myRecipes = currentUser
    ? allRecipes.filter((recipe) => recipe.author?.username === currentUser)
    : [];

  const communityRecipes = allRecipes.filter((recipe) => {
    const username = recipe.author?.username;
    return username && username !== "admin" && username !== currentUser;
  });

  return { communityRecipes, cukkluvRecipes, myRecipes };
};

export const useRecipeStore = create((set, get) => ({
  recipes: [],           // toàn bộ recipes
  communityRecipes: [],  // công thức cộng đồng
  cukkluvRecipes: [],   // công thức của admin
  myRecipes: [],         // công thức của user
  loading: false,
  error: null,

  fetchRecipes: async () => {
    const username = localStorage.getItem("username") || "";
    set({ loading: true, error: null });
    try {
      const allRecipes = await recipesAPI.fetchAllRecipes();
      console.log("All recipes fetched:", allRecipes);
      const categorized = categorizeRecipes(allRecipes, username);
      console.log("Categorized recipes:", categorized);
      set({ 
        recipes: allRecipes, 
        ...categorized, 
        loading: false 
      });
    } catch (err) {
      console.error(err);
      set({ loading: false, error: err.message });
    }
  },

  fetchRecipeDetail: async (id) => {
    const { recipes } = get();
    const existing = recipes.find(r => r.id === parseInt(id));
    if (existing) return existing;

    set({ loading: true, error: null });
    try {
      const recipe = await recipesAPI.fetchRecipeByID(id);
      set({ recipes: [...recipes, recipe], loading: false });
      return recipe;
    } catch (err) {
      console.error(err);
      set({ loading: false, error: err.message });
      return null;
    }
  },
}));
