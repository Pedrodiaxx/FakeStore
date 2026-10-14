import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../models/product.model';
import { QuantityControl } from './QuantityControl';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${product.id}`)}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.content}>
                <Text style={styles.category} numberOfLines={1}>
                    {product.category.toUpperCase()}
                </Text>
                <Text style={styles.title} numberOfLines={2}>
                    {product.title}
                </Text>

                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.ratingText}>{product.rating?.rate ?? 0}</Text>
                    <Text style={styles.ratingCount}>({product.rating?.count ?? 0})</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <QuantityControl product={product} size="small" />
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    category: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginVertical: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0F172A',
    },
    ratingCount: {
        fontSize: 12,
        color: '#94A3B8',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2563EB',
    },
});