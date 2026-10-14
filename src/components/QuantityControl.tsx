import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../hooks/useCart';
import { Product } from '../models/product.model';

interface QuantityControlProps {
    product: Product;
    size?: 'small' | 'medium';
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
    product,
    size = 'medium',
}) => {
    const { getItemQuantity, addItem, decrementItem } = useCart();
    const quantity = getItemQuantity(product.id);

    const isSmall = size === 'small';

    if (quantity === 0) {
        return (
            <TouchableOpacity
                style={[styles.addButton, isSmall && styles.addButtonSmall]}
                onPress={() => addItem(product)}
                activeOpacity={0.7}
            >
                <Ionicons name="cart-outline" size={isSmall ? 16 : 18} color="#FFFFFF" />
                <Text style={[styles.addButtonText, isSmall && styles.addButtonTextSmall]}>
                    Agregar
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.container, isSmall && styles.containerSmall]}>
            <TouchableOpacity
                style={[styles.button, isSmall && styles.buttonSmall]}
                onPress={() => decrementItem(product.id)}
                activeOpacity={0.7}
            >
                <Ionicons name="remove" size={isSmall ? 16 : 18} color="#1E293B" />
            </TouchableOpacity>

            <Text style={[styles.quantityText, isSmall && styles.quantityTextSmall]}>
                {quantity}
            </Text>

            <TouchableOpacity
                style={[styles.button, isSmall && styles.buttonSmall]}
                onPress={() => addItem(product)}
                activeOpacity={0.7}
            >
                <Ionicons name="add" size={isSmall ? 16 : 18} color="#1E293B" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    containerSmall: {
        paddingHorizontal: 2,
        paddingVertical: 1,
    },
    button: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    buttonSmall: {
        padding: 4,
    },
    quantityText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    quantityTextSmall: {
        fontSize: 13,
        marginHorizontal: 8,
        minWidth: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        gap: 6,
    },
    addButtonSmall: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        gap: 4,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    addButtonTextSmall: {
        fontSize: 12,
    },
});