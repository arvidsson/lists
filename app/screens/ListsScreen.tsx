import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { StackNavigation } from '../../App';
import Ionicons from '@expo/vector-icons/Ionicons';
import List, { ListData } from '../components/List';

const ListsScreen = () => {
  const [lists, setLists] = useState<ListData[]>([]);
  const [list, setList] = useState('');

  const navigation = useNavigation<StackNavigation>();

  useEffect(() => {
    const listsRef = collection(db, 'lists');
    const q = query(listsRef, where('owners', 'array-contains', auth.currentUser?.uid));

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        let lists: ListData[] = [];

        snapshot.docs.forEach((doc) => {
          lists.push({
            id: doc.id,
            ...doc.data(),
          } as ListData);
        });

        lists = lists.sort((a: ListData, b: ListData) => a.title.localeCompare(b.title));

        // add empty lists to fill out the page
        const minLists = 15;
        if (lists.length < minLists) {
          const num = minLists - lists.length;
          for (let i = 0; i < num; i++) {
            lists.push({ id: i.toString(), title: ' ', owners: [] });
          }
        }

        setLists(lists);
      },
    });

    return () => subscriber();
  }, []);

  const addList = async () => {
    const uid = auth.currentUser?.uid;
    const doc = await addDoc(collection(db, 'lists'), { title: list, owners: [uid] });
    setList('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add list"
          onChangeText={(text: string) => setList(text)}
          value={list}
          clearButtonMode="always"
          onBlur={() => setList('')}
        />
        <Button onPress={addList} title="Add" disabled={list === ''} />
      </View>
      {lists.length > 0 && (
        <View style={styles.itemsContainer}>
          <FlatList
            data={lists}
            renderItem={({ item }) => <List list={item} />}
            keyExtractor={(list: ListData) => list.id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  form: {
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

export default ListsScreen;
