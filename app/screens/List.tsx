import { View, Text, Button, TextInput, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export interface Item {
  id: string;
  title: string;
  isDone: boolean;
}

const List = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState('');

  useEffect(() => {
    const itemsRef = collection(db, 'items');

    const subscriber = onSnapshot(itemsRef, {
      next: (snapshot) => {
        const items: Item[] = [];
        snapshot.docs.forEach(doc => {
          items.push({
            id: doc.id,
            ...doc.data()
          } as Item);
        });
        setItems(items);
      }
    });

    return () => subscriber();
  }, []);

  const addItem = async () => {
    const doc = await addDoc(collection(db, 'items'), { title: item, isDone: false });
    setItem('');
  };

  const renderItem = ({ item }: any) => {
    return (
      <Text>{item.title}</Text>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder='Add item' onChangeText={(text: string) => setItem(text)} value={item} />
        <Button onPress={addItem} title='Add' disabled={item === ''} />
      </View>
      { items.length > 0 && (
        <View>
          <FlatList data={items} renderItem={(item) => renderItem(item)} keyExtractor={(item: Item) => item.id} />
        </View>
      )}
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
    alignItems: 'center',
    marginBottom: 20
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