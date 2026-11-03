import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setNombre(data.nombre);
        setEmail(data.email);
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    if (!nombre.trim()) return Alert.alert('Error', 'El nombre no puede estar vacío');
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/usuarios/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre })
      });
      
      if (response.ok) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('rol');
    router.replace('/');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      
      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput style={[styles.input, styles.disabled]} value={email} editable={false} />

      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <TouchableOpacity style={styles.saveButton} onPress={guardarCambios} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#0f172a', textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', padding: 12, borderRadius: 8, marginBottom: 20, backgroundColor: '#fff' },
  disabled: { backgroundColor: '#e2e8f0', color: '#64748b' },
  saveButton: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  logoutButton: { backgroundColor: '#ef4444', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});