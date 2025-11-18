// src/hooks/useReviews.js - VERSI ROBUST (Handle berbagai response format)
import { useState, useEffect, useCallback } from 'react';
import reviewService from '../services/reviewService';

/**
 * Custom hook for fetching reviews
 * @param {string} recipeId - Recipe ID
 * @returns {Object} - { reviews, loading, error, refetch }
 */
export function useReviews(recipeId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!recipeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await reviewService.getReviews(recipeId);
      
      console.log('📊 Review response:', response);
      
      // Handle berbagai format response
      let reviewData = [];
      
      if (response.success && response.data) {
        reviewData = response.data;
      } else if (Array.isArray(response)) {
        reviewData = response;
      } else if (response.data && Array.isArray(response.data)) {
        reviewData = response.data;
      }
      
      console.log('✅ Processed reviews:', reviewData);
      setReviews(reviewData);
      
    } catch (err) {
      console.error('❌ Error in fetchReviews:', err);
      setError(err.message || 'An error occurred while fetching reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
}

/**
 * Custom hook for creating a review
 * @returns {Object} - { createReview, loading, error, success }
 */
export function useCreateReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createReview = async (recipeId, reviewData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      console.log('📝 Creating review:', { recipeId, reviewData });
      
      // Validasi data sebelum kirim
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('Rating harus antara 1-5');
      }
      
      if (!reviewData.user_identifier || !reviewData.user_identifier.trim()) {
        throw new Error('User identifier diperlukan');
      }
      
      const response = await reviewService.createReview(recipeId, reviewData);
      
      console.log('📥 Create review response:', response);
      
      // Handle berbagai format success response
      let isSuccess = false;
      
      if (response && response.success === true) {
        isSuccess = true;
      } else if (response && response.data) {
        isSuccess = true;
      } else if (response && response.id) {
        // Jika langsung return data review
        isSuccess = true;
      }
      
      if (isSuccess) {
        console.log('✅ Review created successfully');
        setSuccess(true);
        return true;
      } else {
        console.error('⚠️ Unexpected response format:', response);
        setError('Format response tidak sesuai');
        return false;
      }
      
    } catch (err) {
      console.error('❌ Error creating review:', err);
      console.error('Error stack:', err.stack);
      
      // Parse error message
      let errorMessage = 'Terjadi kesalahan saat membuat ulasan';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = err.error;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      }
      
      setError(errorMessage);
      return false;
      
    } finally {
      setLoading(false);
    }
  };

  return {
    createReview,
    loading,
    error,
    success,
  };
}