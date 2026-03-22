import { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sevimliplay_favorites') || '[]'); }
    catch { return []; }
  });

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      const updated = exists ? prev.filter(f => f.id !== item.id) : [...prev, item];
      localStorage.setItem('sevimliplay_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id) => favorites.some(f => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);