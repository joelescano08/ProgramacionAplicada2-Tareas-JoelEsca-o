import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NuevaReservaScreen() {
  const { servicioId, nombre } = useLocalSearchParams();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');  
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleCrearReserva = async () => {
    if (!fecha.trim() || !hora.trim()) {
      Alert.alert('Atención', 'Ingresa la fecha (YYYY-MM-DD) y la hora (HH:mm).');
      return;
    }

    const fechaHoraReserva = new Date(`${fecha.trim()}T${hora.trim()}`);
    if (isNaN(fechaHoraReserva.getTime())) {
      Alert.alert('Atención', 'Formato no válido. Usa YYYY-MM-DD para fecha y HH:mm para hora.');
      return;
    }

    if (fechaHoraReserva < new Date()) {
      Alert.alert('Atención', 'No puedes realizar una reserva en una fecha u hora pasada.');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          servicioId: Number(servicioId),
          fecha: fecha.trim(),
          hora: hora.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar la reserva.');
      }

      Alert.alert('¡Éxito!', 'Tu reserva ha sido creada correctamente.', [
        {
          text: 'Ver mis reservas',
          onPress: () => router.replace('/reservas' as any),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Reserva</Text>
      {nombre && <Text style={styles.subtitle}>Servicio: {nombre}</Text>}

      <Text style={styles.label}>Fecha (Año-Mes-Día)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 2026-11-15"
        value={fecha}
        onChangeText={setFecha}
      />

      <Text style={styles.label}>Hora (Formato 24 Horas)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 14:30"
        value={hora}
        onChangeText={setHora}
      />

      <TouchableOpacity style={styles.button} onPress={handleCrearReserva} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Confirmar Reserva</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#2563eb', fontWeight: '600', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#ffffff', fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});