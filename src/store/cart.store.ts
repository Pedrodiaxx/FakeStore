import { create } from 'zustand';
import { CartMap } from '../models/cart.model';
import { Product } from '../models/product.model';

interface CartState {
    items: CartMap;
    addItem: (product: Product) => void;
    decrementItem: (productId: number) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    items: {},

    addItem: (product) =>
        set((state) => {
            const existing = state.items[product.id];
            const newQuantity = existing ? existing.quantity + 1 : 1;

            return {
                items: {
                    ...state.items,
                    [product.id]: {
                        product,
                        quantity: newQuantity,
                    },
                },
            };
        }),

    decrementItem: (productId) =>
        set((state) => {
            const existing = state.items[productId];
            if (!existing) return state;

            // Si la cantidad llega a 0, el producto sale del carrito (Requisito 3.3)
            if (existing.quantity <= 1) {
                const nextItems = { ...state.items };
                delete nextItems[productId];
                return { items: nextItems };
            }

            return {
                items: {
                    ...state.items,
                    [productId]: {
                        ...existing,
                        quantity: existing.quantity - 1,
                    },
                },
            };
        }),

    removeItem: (productId) =>
        set((state) => {
            const nextItems = { ...state.items };
            delete nextItems[productId];
            return { items: nextItems };
        }),

    clearCart: () => set({ items: {} }),
}));