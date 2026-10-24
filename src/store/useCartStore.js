import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { promoCodes } from '../constants/promoCodes';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ product, quantity, selectedColor }]
      appliedPromo: null, // { code, discountPercent, minAmount }

      addToCart: (product, quantity = 1, selectedColor = null) => {
        const color = selectedColor || (product.colors?.[0] || 'Default');
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => item.product.id === product.id && item.selectedColor === color
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const newQty = updatedItems[existingIndex].quantity + quantity;
          // Don't exceed available stock
          updatedItems[existingIndex].quantity = Math.min(newQty, product.stock || 99);
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                product,
                quantity: Math.min(quantity, product.stock || 99),
                selectedColor: color
              }
            ]
          });
        }
      },

      removeFromCart: (productId, selectedColor) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && (!selectedColor || item.selectedColor === selectedColor))
          )
        });
      },

      updateQuantity: (productId, quantity, selectedColor) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, selectedColor);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.product.id === productId && (!selectedColor || item.selectedColor === selectedColor)) {
              return {
                ...item,
                quantity: Math.min(quantity, item.product.stock || 99)
              };
            }
            return item;
          })
        });
      },

      clearCart: () => {
        set({ items: [], appliedPromo: null });
      },

      applyPromoCode: (codeStr) => {
        const clean = codeStr.trim().toUpperCase();
        const found = promoCodes.find((p) => p.code === clean && p.isActive);

        if (!found) {
          return { success: false, error: 'promoInvalid' };
        }

        const subtotal = get().getSubtotal();
        if (subtotal < found.minAmount) {
          return {
            success: false,
            error: `Ushbu promokod kamida ${(found.minAmount).toLocaleString()} so'mlik xaridlar uchun amal qiladi`
          };
        }

        set({ appliedPromo: found });
        return { success: true, promo: found };
      },

      removePromoCode: () => {
        set({ appliedPromo: null });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      },

      getTotals: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        let discountAmount = 0;

        if (promo && subtotal >= (promo.minAmount || 0)) {
          discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
        }

        // Free delivery above 500,000 UZS or if cart empty
        const deliveryFee = subtotal === 0 ? 0 : subtotal >= 500000 ? 0 : 30000;
        const total = Math.max(0, subtotal - discountAmount + deliveryFee);
        const totalItems = get().items.reduce((sum, item) => sum + item.quantity, 0);

        return {
          subtotal,
          discountAmount,
          deliveryFee,
          total,
          totalItems
        };
      }
    }),
    {
      name: 'apexstore-cart-storage'
    }
  )
);
