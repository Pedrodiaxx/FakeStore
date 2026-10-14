import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../hooks/useCart';

export const CartBadge: React.FC = () => {
    const router = useRouter();
    const { totalItems } = useCart();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push('/cart')}
            activeOpacity={0.7}
        >
            <Ionicons name="cart" size={24} color="#0F172A" />
            {totalItems > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {totalItems > 99 ? '99+' : totalItems}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        position: 'relative',
        marginRight: 8,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
});