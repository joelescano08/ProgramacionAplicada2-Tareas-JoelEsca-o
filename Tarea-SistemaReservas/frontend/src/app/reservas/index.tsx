import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Reserva {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  servicio: {
    nombre: string;
    precio: number;
  };
}

export default function MisReservasScreen() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/reservas/mis-reservas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener tus reservas.');
      }

      setReservas(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = (id: number) => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que deseas cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`${API_URL}/reservas/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'No se pudo cancelar la reserva.');
              }

              Alert.alert('¡Éxito!', 'Reserva cancelada correctamente.');
              cargarReservas();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reservas.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Aún no tienes ninguna reserva realizada.</Text>
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.serviceName}>{item.servicio?.nombre || 'Servicio'}</Text>
              <Text style={styles.detailText}>📅 Fecha: {item.fecha}</Text>
              <Text style={styles.detailText}>⏰ Hora: {item.hora}</Text>
              <Text style={styles.detailText}>
                Estado:{' '}
                <Text
                  style={[
                    styles.statusTag,
                    item.estado === 'pendiente' && styles.statusPendiente,
                    item.estado === 'completada' && styles.statusCompletada,
                    item.estado === 'cancelada' && styles.statusCancelada,
                  ]}
                >
                  {item.estado.toUpperCase()}
                </Text>
              </Text>

              {item.estado === 'pendiente' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelar(item.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 16 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  detailText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  statusTag: { fontWeight: 'bold' },
  statusPendiente: { color: '#d97706' },
  statusCompletada: { color: '#16a34a' },
  statusCancelada: { color: '#dc2626' },
  cancelButton: { marginTop: 12, backgroundColor: '#ef4444', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  cancelButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});