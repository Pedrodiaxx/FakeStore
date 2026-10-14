import { useCallback, useEffect, useState } from 'react';
import { Product } from '../models/product.model';
import { apiService } from '../services/api.service';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getProducts();
            setProducts(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar productos';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    };
};

export const useProductDetail = (id: number) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!id || isNaN(id)) {
            setError('Identificador de producto no válido');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getProductById(id);
            setProduct(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar el producto';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return {
        product,
        loading,
        error,
        refetch: fetchProduct,
    };
};