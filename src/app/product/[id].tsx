import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { QuantityControl } from '../../components/QuantityControl';
import { useProductDetail } from '../../hooks/useProducts';

export default function ProductDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const productId = Number(id);

    const { product, loading, error, refetch } = useProductDetail(productId);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Cargando información del producto...</Text>
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={56} color="#EF4444" />
                <Text style={styles.errorTitle}>Producto no encontrado</Text>
                <Text style={styles.errorMessage}>{error || 'No fue posible cargar el producto solicitado.'}</Text>
                <View style={styles.errorButtons}>
                    <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Regresar al catálogo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
                </View>

                <View style={styles.detailsCard}>
                    <View style={styles.metaRow}>
                        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={14} color="#F59E0B" />
                            <Text style={styles.ratingText}>{product.rating?.rate ?? 0}</Text>
                            <Text style={styles.ratingCount}>({product.rating?.count ?? 0} opiniones)</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionHeader}>Descripción</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ScrollView>

            {/* Barra fija inferior con controles de carrito */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.bottomBarLabel}>Precio total</Text>
                    <Text style={styles.bottomBarPrice}>${product.price.toFixed(2)}</Text>
                </View>
                <QuantityControl product={product} size="medium" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#64748B',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 12,
    },
    errorMessage: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginVertical: 12,
    },
    errorButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    retryButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#E2E8F0',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#0F172A',
        fontWeight: '600',
    },
    imageContainer: {
        width: '100%',
        height: 320,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    detailsCard: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginTop: 10,
        borderRadius: 16,
        marginHorizontal: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
        letterSpacing: 0.5,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#92400E',
    },
    ratingCount: {
        fontSize: 11,
        color: '#B45309',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        lineHeight: 24,
        marginBottom: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#475569',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomBarLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    bottomBarPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2563EB',
    },
});