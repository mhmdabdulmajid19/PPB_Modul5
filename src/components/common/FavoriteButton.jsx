// src/components/common/FavoriteButton.jsx
/*eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import favoriteService from '../../services/favoriteService';
import userService from '../../services/userService';

/**
 * FavoriteButton Component
 * Toggles favorite status with localStorage support
 */
export default function FavoriteButton({ 
  recipeId, 
  onToggle, 
  showCount = false, 
  initialCount = 0, 
  size = 'md' 
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Size variants
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Check if recipe is favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const userIdentifier = userService.getUserIdentifier();
        const response = await favoriteService.isFavorited(recipeId, userIdentifier);
        
        if (response.success) {
          setIsFavorited(response.data.is_favorited);
        }
      } catch (err) {
        console.error('Error checking favorite status:', err);
      }
    };

    checkFavoriteStatus();
  }, [recipeId]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    
    if (loading) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      setLoading(true);
      const userIdentifier = userService.getUserIdentifier();
      
      // Toggle favorite via API
      const response = await favoriteService.toggleFavorite({
        recipe_id: recipeId,
        user_identifier: userIdentifier,
      });

      if (response.success) {
        const newFavoritedState = response.data.is_favorited;
        setIsFavorited(newFavoritedState);
        
        // Update count
        if (newFavoritedState) {
          setFavoriteCount(prev => prev + 1);
        } else {
          setFavoriteCount(prev => Math.max(0, prev - 1));
        }

        // Callback to parent
        if (onToggle) {
          onToggle(recipeId, newFavoritedState);
        }

        // Show toast notification
        const message = newFavoritedState 
          ? '❤️ Ditambahkan ke favorit' 
          : '💔 Dihapus dari favorit';
        
        // Create simple toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-20 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideIn';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.remove();
        }, 2000);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      
      // Show error toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = '❌ Gagal memperbarui favorit';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-200
        ${isFavorited
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
        }
        backdrop-blur-sm shadow-md hover:shadow-lg
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        group
      `}
      title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${isFavorited ? 'fill-current' : ''}
          ${isAnimating ? 'animate-pulse' : ''}
        `}
      />
      {showCount && favoriteCount > 0 && (
        <span className="text-xs font-semibold">
          {favoriteCount > 999 ? '999+' : favoriteCount}
        </span>
      )}
    </button>
  );
}