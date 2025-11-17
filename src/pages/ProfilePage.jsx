// src/pages/ProfilePage.jsx
/*eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Camera, Edit2, Heart, User, Clock, Star } from 'lucide-react';
import userService from '../services/userService';
import { useFavorites } from '../hooks/useFavorites';

export default function ProfilePage({ onRecipeClick }) {
  const [profile, setProfile] = useState({
    username: '',
    avatar: null,
    bio: ''
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const { favorites, loading: favLoading, refetch } = useFavorites();

  useEffect(() => {
    const userProfile = userService.getUserProfile();
    setProfile(userProfile);
    setTempUsername(userProfile.username);
  }, []);

  // Refetch favorites when component mounts or when returning to this page
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = userService.updateAvatar(reader.result);
      if (result.success) {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
        alert('Avatar berhasil diperbarui!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUsernameUpdate = () => {
    if (!tempUsername.trim()) {
      alert('Username tidak boleh kosong');
      return;
    }
    
    const result = userService.updateUsername(tempUsername);
    if (result.success) {
      setProfile(prev => ({ ...prev, username: tempUsername }));
      setIsEditingUsername(false);
      alert('Username berhasil diperbarui!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Profil Saya</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Username Section */}
            <div className="flex-1 text-center md:text-left">
              {isEditingUsername ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Username"
                  />
                  <button
                    onClick={handleUsernameUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingUsername(false);
                      setTempUsername(profile.username);
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h2 className="text-2xl font-bold text-slate-800">{profile.username}</h2>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <p className="text-slate-500 mt-2 text-sm">ID: {profile.userId}</p>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <h2 className="text-2xl font-bold text-slate-800">Resep Favorit</h2>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {favorites.length}
            </span>
          </div>

          {favLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Memuat favorit...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Belum ada resep favorit</p>
              <p className="text-slate-400 text-sm mt-2">
                Tambahkan resep ke favorit untuk melihatnya di sini
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onRecipeClick && onRecipeClick(recipe.id, recipe.category)}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        recipe.category === 'makanan' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {recipe.category === 'makanan' ? 'Makanan' : 'Minuman'}
                      </span>
                    </div>

                    {/* Recipe Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm line-clamp-2">
                        {recipe.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Recipe Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{recipe.prep_time} mnt</span>
                      </div>
                      {recipe.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="font-medium">{recipe.average_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-500 capitalize">
                      Kesulitan: <span className="font-medium">{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}