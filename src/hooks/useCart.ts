import { useCallback, useMemo } from 'react';
import { useCartStore } from '../store/cart.store';

export const useCart = () => {
    const items = useCartStore((state) => state.items);
    const addItem = useCartStore((state) => state.addItem);
    const decrementItem = useCartStore((state) => state.decrementItem);
    const removeItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clearCart);

    // Convierte el mapa de items a arreglo para renderizar en FlatLists
    const cartList = useMemo(() => Object.values(items), [items]);

    // Total acumulado de unidades para el badge del carrito
    const totalItems = useMemo(() => {
        return Object.values(items).reduce((acc, item) => acc + item.quantity, 0);
    }, [items]);

    // Importe monetario total calculado con precisión de dos decimales
    const totalPrice = useMemo(() => {
        const sum = Object.values(items).reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
        );
        return Number(sum.toFixed(2));
    }, [items]);

    // Selector memoizado para obtener la cantidad de un producto específico en O(1)
    const getItemQuantity = useCallback(
        (productId: number): number => {
            return items[productId]?.quantity ?? 0;
        },
        [items]
    );

    return {
        items,
        cartList,
        totalItems,
        totalPrice,
        addItem,
        decrementItem,
        removeItem,
        clearCart,
        getItemQuantity,
    };
};