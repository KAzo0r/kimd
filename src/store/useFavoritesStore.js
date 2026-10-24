import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [], // array of product objects

      toggleFavorite: (product) => {
        const current = get().favorites;
        const exists = current.some((p) => p.id === product.id);

        if (exists) {
          set({ favorites: current.filter((p) => p.id !== product.id) });
        } else {
          set({ favorites: [...current, product] });
        }
      },

      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      }
    }),
    {
      name: 'apexstore-favorites-storage'
    }
  )
);
