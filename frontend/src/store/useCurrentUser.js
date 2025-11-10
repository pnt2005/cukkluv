import { useState, useEffect } from "react";
import { fetchCurrentUser } from "./RecipeService";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const username = await fetchCurrentUser();
        setCurrentUser(username || "");
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { currentUser, loading, error };
};