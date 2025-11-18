// src/services/reviewService.js - DIPERBAIKI
import { apiClient } from '../config/api';

class ReviewService {
  /**
   * Get all reviews for a recipe
   * @param {string} recipeId - Recipe ID
   * @returns {Promise}
   */
  async getReviews(recipeId) {
    try {
      console.log('🔍 Fetching reviews for recipe:', recipeId);
      const response = await apiClient.get(`/api/v1/recipes/${recipeId}/reviews`);
      console.log('✅ Reviews fetched:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      throw error;
    }
  }

  /**
   * Create review for a recipe
   * @param {string} recipeId - Recipe ID
   * @param {Object} reviewData - Review data
   * @param {string} reviewData.user_identifier - User identifier
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment (optional)
   * @returns {Promise}
   */
  async createReview(recipeId, reviewData) {
    try {
      console.log('📤 Sending review to API:', {
        url: `/api/v1/recipes/${recipeId}/reviews`,
        data: reviewData
      });
      
      const response = await apiClient.post(
        `/api/v1/recipes/${recipeId}/reviews`, 
        reviewData
      );
      
      console.log('✅ Review created:', response);
      return response;
    } catch (error) {
      console.error('❌ Error creating review:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  /**
   * Update existing review
   * @param {string} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment (optional)
   * @returns {Promise}
   */
  async updateReview(reviewId, reviewData) {
    try {
      const response = await apiClient.put(`/api/v1/reviews/${reviewId}`, reviewData);
      return response;
    } catch (error) {
      console.error('❌ Error updating review:', error);
      throw error;
    }
  }

  /**
   * Delete review
   * @param {string} reviewId - Review ID
   * @returns {Promise}
   */
  async deleteReview(reviewId) {
    try {
      const response = await apiClient.delete(`/api/v1/reviews/${reviewId}`);
      return response;
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      throw error;
    }
  }
}

export default new ReviewService();