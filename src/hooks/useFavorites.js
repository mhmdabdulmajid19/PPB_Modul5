import { useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService';
import recipeService from '../services/recipeService';
import userService from '../services/userService';

/**
 * Get user identifier from localStorage or generate new one
 */
const getUserIdentifier = () => {
  return userService.getUserIdentifier();
};

/**
 * Custom hook for fetching favorites with full recipe details
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get favorite IDs from API
      const response = await favoriteService.getFavorites(userIdentifier);
      
      if (response.success && response.data && response.data.length > 0) {
        // Fetch full recipe details for each favorite
        const recipePromises = response.data.map(async (fav) => {
          try {
            const recipeResponse = await recipeService.getRecipeById(fav.recipe_id);
            if (recipeResponse.success && recipeResponse.data) {
              return {
                ...recipeResponse.data,
                favorite_id: fav.id,
                favorited_at: fav.created_at
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching recipe ${fav.recipe_id}:`, err);
            return null;
          }
        });

        const recipesData = await Promise.all(recipePromises);
        const validRecipes = recipesData.filter(recipe => recipe !== null);
        
        setFavorites(validRecipes);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.message || 'An error occurred while fetching favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [userIdentifier]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
  };
}

/**
 * Custom hook for toggling favorites
 */
export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();

  const toggleFavorite = async (recipeId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await favoriteService.toggleFavorite({
        recipe_id: recipeId,
        user_identifier: userIdentifier,
      });
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to toggle favorite');
        return null;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while toggling favorite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleFavorite,
    loading,
    error,
  };
}

/**
 * Custom hook to check if a recipe is favorited
 */
export function useIsFavorited(recipeId) {
  const { favorites, loading: fetchLoading, refetch } = useFavorites();
  const { toggleFavorite: toggle, loading: toggleLoading } = useToggleFavorite();

  const isFavorited = favorites.some(fav => fav.id === recipeId);

  const toggleFavorite = async () => {
    const result = await toggle(recipeId);
    if (result) {
      await refetch();
    }
    return result;
  };

  return {
    isFavorited,
    loading: fetchLoading || toggleLoading,
    toggleFavorite,
  };
}

export { getUserIdentifier };