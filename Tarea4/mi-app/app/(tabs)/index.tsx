import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [texto, setTexto] = useState('');

  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto}>Nombre: [Joel Escaño Guzmán]</Text>
      <Text style={styles.texto}>Matrícula: [1000-4369]</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe algo aquí..."
        value={texto}
        onChangeText={setTexto}
      />
      <Button 
        title="Mostrar Texto" 
        onPress={() => Alert.alert("Ingresaste:", texto)} 
      />

      <View style={{ marginTop: 30 }}>
        <Button 
          title="Ir a la Lista" 
          onPress={() => router.push('/lista')} 
          color="green"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  texto: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  }
});