import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const List = () => {
  const [items, setItems] = useState<any[]>([]);
  const [item, setItem] = useState('');

  const addItem = async () => {
    const doc = await addDoc(collection(db, 'items'), { title: item, isDone: false });
    setItem('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder='Add item' onChangeText={(text: string) => setItem(text)} value={item} />
        <Button onPress={addItem} title='Add' disabled={item === ''} />
      </View>
    </View>
  )
}

export default List

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 20
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  }
});