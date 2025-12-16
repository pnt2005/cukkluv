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
  recipe: null,          // recipe detail hiện tại
  loading: false,
  error: null,

  // Fetch tất cả recipes và phân loại
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
      console.error("Fetch recipes error:", err);
      set({ loading: false, error: err.message });
    }
  },

  // Fetch recipe detail theo ID
  fetchRecipeDetail: async (id) => {
    set({ loading: true, error: null });
    
    const { recipes } = get();
    
    // Tìm trong cache trước
    const existing = recipes.find(r => r.id === parseInt(id));
    if (existing) {
      set({ recipe: existing, loading: false });
      return;
    }

    // Nếu chưa có, fetch từ API
    try {
      const fetchedRecipe = await recipesAPI.fetchRecipeByID(id);
      
      set((state) => ({
        recipes: [...state.recipes, fetchedRecipe],
        recipe: fetchedRecipe,
        loading: false
      }));
    } catch (err) {
      console.error("Fetch recipe detail error:", err);
      set({ loading: false, error: err.message });
    }
  },

  // Update recipe trong store (sau khi edit thành công)
  updateRecipeInStore: (updatedRecipe) => {
    const username = localStorage.getItem("username") || "";
    
    set((state) => {
      // Update trong recipes array
      const newRecipes = state.recipes.map((r) =>
        r.id === updatedRecipe.id ? updatedRecipe : r
      );

      // Re-categorize sau khi update
      const categorized = categorizeRecipes(newRecipes, username);

      // Update recipe detail nếu đang xem recipe này
      const newRecipe = state.recipe?.id === updatedRecipe.id 
        ? updatedRecipe 
        : state.recipe;

      return {
        recipes: newRecipes,
        ...categorized,
        recipe: newRecipe
      };
    });
  },

  // Delete recipe khỏi store
  deleteRecipeFromStore: (recipeId) => {
    const username = localStorage.getItem("username") || "";
    
    set((state) => {
      // Remove khỏi recipes array
      const newRecipes = state.recipes.filter(r => r.id !== recipeId);

      // Re-categorize sau khi delete
      const categorized = categorizeRecipes(newRecipes, username);

      // Clear recipe detail nếu đang xem recipe bị xóa
      const newRecipe = state.recipe?.id === recipeId ? null : state.recipe;

      return {
        recipes: newRecipes,
        ...categorized,
        recipe: newRecipe
      };
    });
  },

  // Add recipe mới vào store (sau khi tạo thành công)
  addRecipeToStore: (newRecipe) => {
    const username = localStorage.getItem("username") || "";
    
    set((state) => {
      const newRecipes = [...state.recipes, newRecipe];
      const categorized = categorizeRecipes(newRecipes, username);

      return {
        recipes: newRecipes,
        ...categorized
      };
    });
  },

  // Clear current recipe detail
  clearRecipeDetail: () => {
    set({ recipe: null });
  },

  // Re-categorize khi user thay đổi (login/logout)
  recategorizeRecipes: () => {
    const username = localStorage.getItem("username") || "";
    const { recipes } = get();
    
    const categorized = categorizeRecipes(recipes, username);
    set(categorized);
  }
}));