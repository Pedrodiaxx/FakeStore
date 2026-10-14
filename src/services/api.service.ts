import { Product } from '../models/product.model';

const API_BASE_URL = 'https://fakestoreapi.com';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de tiempo de vida

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class ApiService {
    private productsCache: CacheEntry<Product[]> | null = null;
    private productDetailCache: Map<number, CacheEntry<Product>> = new Map();

    async getProducts(): Promise<Product[]> {
        const now = Date.now();

        // Verificamos si existe caché válida
        if (this.productsCache && now - this.productsCache.timestamp < CACHE_TTL_MS) {
            return this.productsCache.data;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }

            const data: Product[] = await response.json();

            // Actualizamos caché en memoria y alimentamos la de detalles
            this.productsCache = { data, timestamp: now };
            data.forEach(item => {
                this.productDetailCache.set(item.id, { data: item, timestamp: now });
            });

            return data;
        } catch (error) {
            // Si la red falla pero tenemos una copia previa en memoria, la retornamos como respaldo
            if (this.productsCache) {
                return this.productsCache.data;
            }
            throw error instanceof Error ? error : new Error('Error de conexión desconocido');
        }
    }

    async getProductById(id: number): Promise<Product> {
        const now = Date.now();
        const cached = this.productDetailCache.get(id);

        if (cached && now - cached.timestamp < CACHE_TTL_MS) {
            return cached.data;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) {
                throw new Error(`Producto no encontrado (código ${response.status})`);
            }

            const data: Product = await response.json();
            this.productDetailCache.set(id, { data, timestamp: now });
            return data;
        } catch (error) {
            if (cached) {
                return cached.data;
            }
            throw error instanceof Error ? error : new Error('Error al obtener el producto');
        }
    }

    clearCache(): void {
        this.productsCache = null;
        this.productDetailCache.clear();
    }
}

export const apiService = new ApiService();