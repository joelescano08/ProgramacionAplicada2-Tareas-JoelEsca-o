import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const DATOS = [
  { id: '1', nombre: 'Maracuyan' },
  { id: '2', nombre: 'Melón' },
  { id: '3', nombre: 'FrutaUcne' },
  { id: '4', nombre: 'Mango' },
  { id: '5', nombre: 'Calabaza' },
];

export default function ListaScreen() {
  return (
    <View style={styles.contenedor}>
      
      <FlatList
        data={DATOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.id} - {item.nombre}</Text>
        )}
      />

      <Button 
        title="Volver al Home" 
        onPress={() => router.push('/')} 
        color="green"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  item: {
    fontSize: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});