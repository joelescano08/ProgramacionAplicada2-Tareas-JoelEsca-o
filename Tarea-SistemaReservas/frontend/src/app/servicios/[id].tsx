import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}

export default function DetalleServicioScreen() {
  const { id } = useLocalSearchParams();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (id) cargarServicio();
  }, [id]);

  const cargarServicio = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/servicios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        const encontrado = data.find((s: Servicio) => s.id === Number(id));
        if (encontrado) {
          setServicio(encontrado);
        } else {
          Alert.alert('Error', 'Servicio no encontrado');
        }
      } else {
        throw new Error(data.error || 'Error al obtener información del servicio');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!servicio) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No se encontró la información del servicio.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{servicio.nombre}</Text>
        <Text style={styles.description}>{servicio.descripcion}</Text>
        <Text style={styles.detail}>Duración: {servicio.duracion} minutos</Text>
        <Text style={styles.price}>Precio: ${servicio.precio}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: '/reservas/nueva' as any,
              params: { servicioId: servicio.id, nombre: servicio.nombre },
            })
          }
        >
          <Text style={styles.buttonText}>Reservar este Servicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc', justifyContent: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  description: { fontSize: 16, color: '#475569', marginBottom: 16, lineHeight: 22 },
  detail: { fontSize: 15, color: '#64748b', marginBottom: 8 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#16a34a', marginBottom: 24 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: '#64748b', fontSize: 16 },
});