import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartBadge } from '../components/CartBadge';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#0F172A',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Mini Desk Store',
            headerRight: () => <CartBadge />,
          }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: 'Detalle de Producto',
            headerBackTitle: 'Volver',
            headerRight: () => <CartBadge />,
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: 'Mi Carrito',
            headerBackTitle: 'Tienda',
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            title: 'Finalizar Compra',
            headerBackTitle: 'Carrito',
          }}
        />
      </Stack>
    </>
  );
}