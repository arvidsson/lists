import { View, Text, Button, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { StackParamList } from '../../App';

interface IItem {
  id: string;
  title: string;
  isDone: boolean;
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [items, setItems] = useState<IItem[]>([]);
  const [item, setItem] = useState('');

  const route = useRoute<RouteProp<StackParamList, 'List'>>();
  const list = route.params?.list;

  useEffect(() => {
    navigation.setOptions({
      title: list?.title,
    });

    const itemsRef = collection(db, 'items');
    const q = query(itemsRef, where("listId", "==", list?.id));

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        const items: IItem[] = [];
        snapshot.docs.forEach(doc => {
          items.push({
            id: doc.id,
            ...doc.data()
          } as IItem);
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
          <FlatList data={items} renderItem={(item) => renderItem(item)} keyExtractor={(item: IItem) => item.id} />
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