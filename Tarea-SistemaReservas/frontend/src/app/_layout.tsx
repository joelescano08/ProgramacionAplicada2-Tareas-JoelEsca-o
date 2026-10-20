import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="registro" options={{ title: 'Registro de Usuario' }} />
      <Stack.Screen name="servicios" options={{ title: 'Servicios' }} />
      <Stack.Screen name="crear-servicio" options={{ title: 'Nuevo Servicio' }} />
    </Stack>
  );
}