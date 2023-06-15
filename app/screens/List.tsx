import { View, Text, Button, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';

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
    const itemRef = doc(db, `items/${item.id}`);

    const toggleDone = async () => {
      updateDoc(itemRef, {isDone: !item.isDone});
    }

    const deleteItem = async () => {
      deleteDoc(itemRef);
    }

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.item} onPress={toggleDone}>
          <Text style={[styles.itemText, item.isDone && styles.itemDone]}>{item.title}</Text>
        </TouchableOpacity>
        {/* <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} /> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder='Add item' onChangeText={(text: string) => setItem(text)} value={item} />
        <Button onPress={addItem} title='Add' disabled={item === ''} />
      </View>
      { items.length > 0 && (
        <View style={styles.itemsContainer}>
          <FlatList data={items} renderItem={(item) => renderItem(item)} keyExtractor={(item: Item) => item.id} />
        </View>
      )}
    </View>
  )
}

export default List

const styles = StyleSheet.create({
  container: {
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  },
  itemsContainer: {
    height: '100%'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8296a1'
  },
  item: {
    flex: 1,
    paddingHorizontal: 20
  },
  itemText: {
    fontFamily: 'Noteworthy',
    fontSize: 28
  },
  itemDone: {
    textDecorationLine: 'line-through'
  }
});