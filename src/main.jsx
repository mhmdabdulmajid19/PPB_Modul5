// src/main.jsx
import { StrictMode, useState, useEffect } from 'react'; // <-- Ditambahkan useEffect
import { createRoot } from 'react-dom/client';
import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import './index.css';
import PWABadge from './PWABadge';

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mode, setMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    
    // Hapus parameter URL saat navigasi ke halaman list
    const url = new URL(window.location);
    url.searchParams.delete('recipe');
    window.history.pushState({}, '', url);
  };

  const handleCreateRecipe = () => {
    setMode('create');
  };

  // UPDATE: handleRecipeClick untuk update URL
  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    setSelectedCategory(category || currentPage);
    setMode('detail');
    
    // Update URL tanpa reload
    const url = new URL(window.location);
    url.searchParams.set('recipe', recipeId);
    window.history.pushState({}, '', url);
  };

  const handleEditRecipe = (recipeId) => {
    console.log('✏️ Edit button clicked! Recipe ID:', recipeId);
    setEditingRecipeId(recipeId);
    setMode('edit');
    console.log('🔄 Mode changed to: edit');
  };

  // UPDATE: handleBack untuk membersihkan URL
  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    
    // Hapus parameter URL saat kembali ke tampilan daftar
    const url = new URL(window.location);
    url.searchParams.delete('recipe');
    window.history.pushState({}, '', url);
  };

  const handleCreateSuccess = (newRecipe) => {
    alert('Resep berhasil dibuat!');
    
    // Bersihkan URL
    const url = new URL(window.location);
    url.searchParams.delete('recipe');
    window.history.pushState({}, '', url);
    
    setMode('list');
    
    // Optionally navigate to the new recipe's category
    if (newRecipe && newRecipe.category) {
      setCurrentPage(newRecipe.category);
    }
  };

  const handleEditSuccess = (updatedRecipe) => {
    console.log('✅ Recipe updated successfully:', updatedRecipe);
    alert('Resep berhasil diperbarui!');
    
    // Bersihkan URL
    const url = new URL(window.location);
    url.searchParams.delete('recipe');
    window.history.pushState({}, '', url);
    
    setMode('list');
  };
  
  // UPDATE: useEffect hook untuk membaca URL saat pertama kali dimuat
  useEffect(() => {
    // Hanya periksa param URL setelah splash screen selesai
    if (!showSplash) {
        const params = new URLSearchParams(window.location.search);
        const recipeId = params.get('recipe');
        
        if (recipeId) {
            // Panggil handleRecipeClick untuk mengatur state mode 'detail'
            // Menggunakan undefined untuk category agar fallback ke currentPage
            handleRecipeClick(recipeId, undefined); 
        }
    }
  }, [showSplash]); // Dipanggil setelah state showSplash berubah

  const renderCurrentPage = () => {
    // Show Create Recipe Page
    if (mode === 'create') {
      return (
        <CreateRecipePage
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      );
    }

    // Show Edit Recipe Page
    if (mode === 'edit') {
      return (
        <EditRecipePage
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    // Show Recipe Detail
    if (mode === 'detail') {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    // Show List Pages
    switch (currentPage) {
      case 'home':
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage onRecipeClick={handleRecipeClick} />;
      case 'profile':
        return <ProfilePage onRecipeClick={handleRecipeClick} />;
      default:
        return <HomePage onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show navbar in list mode */}
      {mode === 'list' && (
        <>
          <DesktopNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        {renderCurrentPage()}
      </main>

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);