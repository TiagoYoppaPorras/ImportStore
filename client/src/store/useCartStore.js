import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      // Action to add item
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...currentItems, { product, quantity }] });
        }
      },
      // Action to remove item
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
      },
      // Action to clear cart
      clearCart: () => set({ items: [] }),
      // Computed property pattern (or just derived on the fly in components)
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.product.retail_price * item.quantity), 0);
      }
    }),
    {
      name: 'import-store-cart', // local storage key
    }
  )
);
