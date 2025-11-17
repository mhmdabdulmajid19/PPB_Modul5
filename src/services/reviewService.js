import { apiClient } from '../config/api';

class ReviewService {
  async getReviews(recipeId) {
    try {
      const response = await apiClient.get(`/api/v1/reviews/${recipeId}`);
      return response;
    } catch (err) {
      console.error('Error fetching reviews:', err);
      throw err;
    }
  }

  async createReview(recipeId, data) {
    try {
      const response = await apiClient.post(`/api/v1/reviews/${recipeId}`, data);
      return response;
    } catch (err) {
      console.error('Error creating review:', err);
      throw err;
    }
  }

  async updateReview(reviewId, reviewData) {
    try {
      const response = await apiClient.put(
        `/api/v1/reviews/${reviewId}`,
        reviewData
      );
      return response;
    } catch (err) {
      console.error('Error updating review:', err);
      throw err;
    }
  }

  async deleteReview(reviewId) {
    try {
      const response = await apiClient.delete(`/api/v1/reviews/${reviewId}`);
      return response;
    } catch (err) {
      console.error('Error deleting review:', err);
      throw err;
    }
  }

}




export default new ReviewService();
