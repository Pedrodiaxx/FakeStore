import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { QuantityControl } from '../components/QuantityControl';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../models/cart.model';

export default function CartScreen() {
    const router = useRouter();
    const { cartList, totalPrice, totalItems, removeItem } = useCart();

    // Estado vacío contemplado
    if (cartList.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                    <Ionicons name="cart-outline" size={64} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
                <Text style={styles.emptySubtitle}>
                    Explora nuestro catálogo y agrega los productos que más te gusten.
                </Text>
                <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => router.push('/')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.exploreButtonText}>Explorar catálogo</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderItem = ({ item }: { item: CartItem }) => {
        const lineSubtotal = (item.product.price * item.quantity).toFixed(2);

        return (
            <View style={styles.itemCard}>
                <Image
                    source={{ uri: item.product.image }}
                    style={styles.itemImage}
                    resizeMode="contain"
                />

                <View style={styles.itemInfo}>
                    <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle} numberOfLines={2}>
                            {item.product.title}
                        </Text>
                        {/* Opción de eliminar línea completa */}
                        <TouchableOpacity
                            onPress={() => removeItem(item.product.id)}
                            style={styles.deleteButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.unitPrice}>
                        Precio unitario: ${item.product.price.toFixed(2)}
                    </Text>

                    <View style={styles.itemFooter}>
                        <Text style={styles.subtotalText}>
                            Subtotal: <Text style={styles.subtotalValue}>${lineSubtotal}</Text>
                        </Text>
                        <QuantityControl product={item.product} size="small" />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cartList}
                keyExtractor={(item) => item.product.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Resumen y total general */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total de artículos:</Text>
                    <Text style={styles.summaryValue}>{totalItems} unidades</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total general:</Text>
                    <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                </View>

                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => router.push('/checkout')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.checkoutButtonText}>Continuar al pago</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    listContent: {
        padding: 16,
        paddingBottom: 200,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#F8FAFC',
    },
    emptyIconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    exploreButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
    itemCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    deleteButton: {
        padding: 4,
    },
    unitPrice: {
        fontSize: 13,
        color: '#64748B',
        marginVertical: 4,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    subtotalText: {
        fontSize: 13,
        color: '#64748B',
    },
    subtotalValue: {
        fontWeight: '700',
        color: '#0F172A',
    },
    summaryCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2563EB',
    },
    checkoutButton: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 14,
        gap: 8,
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});