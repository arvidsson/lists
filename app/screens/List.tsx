import { View, Button, TextInput, StyleSheet, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { NavigationProp, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../../App';
import Item, { ItemData } from '../components/Item';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [item, setItem] = useState('');

  const route = useRoute<RouteProp<StackParamList, 'List'>>();
  const list = route.params?.list;

  // load all items
  useEffect(() => {
    navigation.setOptions({
      title: list?.title,
    });

    const itemsRef = collection(db, 'items');
    const q = query(itemsRef, where('listId', '==', list?.id));

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        let items: ItemData[] = [];
        snapshot.docs.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          } as ItemData);
        });

        // sort alphabetically and then by isDone
        items = items.sort((a: ItemData, b: ItemData) => a.title.localeCompare(b.title));
        items = items.sort((a: ItemData, b: ItemData) =>
          a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1,
        );

        // add empty items to fill out the page
        const minItems = 15;
        if (items.length < minItems) {
          const num = minItems - items.length;
          for (let i = 0; i < num; i++) {
            items.push({ id: i.toString(), title: ' ', isDone: false });
          }
        }

        setItems(items);
      },
    });

    return () => subscriber();
  }, []);

  // TODO: consider not deleting in the future
  useFocusEffect(
    useCallback(() => {
      return async () => {
        console.log('exiting list and removing all done items');
        const itemsRef = collection(db, 'items');
        const q = query(itemsRef, where('isDone', '==', true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      };
    }, []),
  );

  const addItem = async () => {
    const doc = await addDoc(collection(db, 'items'), {
      title: item,
      isDone: false,
      listId: list?.id,
    });
    setItem('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Add item"
          onChangeText={(text: string) => setItem(text)}
          onSubmitEditing={addItem}
          value={item}
          blurOnSubmit={false}
          clearButtonMode="while-editing"
        />
        <Button onPress={addItem} title="Add" disabled={item === ''} />
      </View>
      {items.length > 0 && (
        <View style={styles.itemsContainer}>
          <FlatList
            data={items}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item: ItemData) => item.id}
          />
        </View>
      )}
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {},
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  itemsContainer: {
    height: '100%',
  },
});
