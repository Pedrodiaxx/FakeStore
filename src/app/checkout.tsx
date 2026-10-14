import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCart } from '../hooks/useCart';

export default function CheckoutScreen() {
    const router = useRouter();
    const { totalPrice, totalItems, clearCart } = useCart();

    // Estados locales para el formulario simulado
    const [name, setName] = useState('Juan Pérez');
    const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
    const [expiry, setExpiry] = useState('12/28');
    const [cvc, setCvc] = useState('123');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));

    const handleProcessPayment = () => {
        setIsProcessing(true);

        // Simula una latencia de red de 1 segundo para la pasarela mock
        setTimeout(() => {
            clearCart(); // Vacía el carrito por completo (Requisito 3.5)
            setIsProcessing(false);
            setIsSuccess(true);
        }, 1000);
    };

    // Estado de éxito tras el pago
    if (isSuccess) {
        return (
            <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                    <Ionicons name="checkmark-circle" size={80} color="#10B981" />
                </View>

                <Text style={styles.successTitle}>¡Pago completado con éxito!</Text>
                <Text style={styles.successSubtitle}>
                    Tu pedido ha sido procesado correctamente y se encuentra en preparación.
                </Text>

                <View style={styles.receiptCard}>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Número de orden:</Text>
                        <Text style={styles.receiptValue}>#{orderNumber}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Total pagado:</Text>
                        <Text style={styles.receiptValue}>${totalPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Artículos:</Text>
                        <Text style={styles.receiptValue}>{totalItems} unidades</Text>
                    </View>
                </View>

                {/* router.replace impide regresar a este checkout procesado con el botón 'Atrás' */}
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.homeButtonText}>Volver al catálogo</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Datos del comprador</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre completo</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nombre y apellido"
                />
            </View>

            <Text style={styles.sectionTitle}>Método de pago (Simulado)</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de tarjeta</Text>
                <TextInput
                    style={styles.input}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Expiración</Text>
                    <TextInput
                        style={styles.input}
                        value={expiry}
                        onChangeText={setExpiry}
                        placeholder="MM/AA"
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>CVC</Text>
                    <TextInput
                        style={styles.input}
                        value={cvc}
                        onChangeText={setCvc}
                        keyboardType="numeric"
                        secureTextEntry
                    />
                </View>
            </View>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumen del pedido</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Cantidad de artículos:</Text>
                    <Text style={styles.summaryValue}>{totalItems} unidades</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Importe final:</Text>
                    <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                onPress={handleProcessPayment}
                disabled={isProcessing}
                activeOpacity={0.8}
            >
                {isProcessing ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <>
                        <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                        <Text style={styles.payButtonText}>Confirmar y pagar</Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 10,
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 14,
    },
    inputLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#0F172A',
    },
    row: {
        flexDirection: 'row',
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 18,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
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
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2563EB',
    },
    payButton: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        gap: 8,
    },
    payButtonDisabled: {
        opacity: 0.7,
    },
    payButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 28,
        backgroundColor: '#F8FAFC',
    },
    successIconCircle: {
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    receiptCard: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 12,
        padding: 16,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    receiptLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    receiptValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    homeButton: {
        backgroundColor: '#2563EB',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});