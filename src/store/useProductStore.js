import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProducts } from '../constants/mockProducts';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: mockProducts,

      addProduct: (newProduct) => {
        const id = 'prod-' + Date.now();
        const product = {
          ...newProduct,
          id,
          rating: newProduct.rating || 5.0,
          reviewsCount: newProduct.reviewsCount || 0,
          reviews: newProduct.reviews || [],
          stock: Number(newProduct.stock) || 0,
          price: Number(newProduct.price) || 0,
          oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : null,
          images: newProduct.images?.length > 0 ? newProduct.images : [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
          ]
        };
        set({ products: [product, ...get().products] });
        return product;
      },

      updateProduct: (id, updatedFields) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          )
        });
      },

      deleteProduct: (id) => {
        set({
          products: get().products.filter((p) => p.id !== id)
        });
      },

      reduceStock: (items) => {
        // items is array of { id, quantity }
        set({
          products: get().products.map((p) => {
            const purchased = items.find((item) => item.id === p.id);
            if (purchased) {
              const newStock = Math.max(0, p.stock - purchased.quantity);
              return { ...p, stock: newStock };
            }
            return p;
          })
        });
      },

      addReview: (productId, review) => {
        const reviewObj = {
          id: Date.now(),
          author: review.author,
          rating: Number(review.rating),
          comment: review.comment,
          date: new Date().toISOString().split('T')[0]
        };

        set({
          products: get().products.map((p) => {
            if (p.id === productId) {
              const currentReviews = p.reviews || [];
              const updatedReviews = [reviewObj, ...currentReviews];
              const avgRating = Number(
                (
                  updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
                  updatedReviews.length
                ).toFixed(1)
              );
              return {
                ...p,
                reviews: updatedReviews,
                reviewsCount: updatedReviews.length,
                rating: avgRating
              };
            }
            return p;
          })
        });
      },

      resetToDefault: () => {
        set({ products: mockProducts });
      }
    }),
    {
      name: 'apexstore-products-storage'
    }
  )
);
