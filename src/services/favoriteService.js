import { apiClient } from '../config/api';

class FavoriteService {
  async getFavorites(userIdentifier) {
    try {
      const response = await apiClient.get(`/api/v1/favorites?user=${userIdentifier}`);
      return response;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  async addFavorite(recipeId, userIdentifier) {
    try {
      const response = await apiClient.post('/api/v1/favorites', {
        recipe_id: recipeId,
        user_identifier: userIdentifier,
      });
      return response;
    } catch (err) {
      console.error('Error adding favorite:', err);
      throw err;
    }
  }

  async removeFavorite(recipeId, userIdentifier) {
    try {
      const response = await apiClient.delete(`/api/v1/favorites/${recipeId}`, {
        data: { user_identifier: userIdentifier },
      });
      return response;
    } catch (err) {
      console.error('Error removing favorite:', err);
      throw err;
    }
  }

  async isFavorited(recipeId, userIdentifier) {
    try {
      const response = await apiClient.get(
        `/api/v1/favorites/check/${recipeId}?user=${userIdentifier}`
      );
      return response;
    } catch (err) {
      console.error('Error checking favorite status:', err);
      throw err;
    }
  }

  async toggleFavorite(data) {
    try {
      const response = await apiClient.post(`/api/v1/favorites/toggle/${data.recipe_id}`, data);
      return response;
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      throw err;
    }
  }
}

export default new FavoriteService();
