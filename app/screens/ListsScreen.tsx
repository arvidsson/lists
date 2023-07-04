import { View, StyleSheet, TextInput, Button, FlatList, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { addDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import List, { ListData } from '../components/List';
import { colors } from '../Theme';
import { NetworkContext } from '../../network';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListsScreen = () => {
  const { isConnected } = useContext(NetworkContext);
  const [lists, setLists] = useState<ListData[]>([]);
  const [list, setList] = useState('');

  useEffect(() => {
    if (!isConnected) {
      loadListsFromStorage();
      return;
    }

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

        saveListsInStorage(lists);
        setLists(lists);
      },
    });

    return () => subscriber();
  }, []);

  const saveListsInStorage = async (lists: ListData[]) => {
    try {
      const jsonValue = JSON.stringify(lists);
      await AsyncStorage.setItem('lists', jsonValue);
    } catch (e) {
      console.log('failed to save to storage: ', e);
    }
  };

  const loadListsFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('lists');
      if (jsonValue !== null) {
        setLists(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log('failed to load from storage: ', e);
    }
  };

  const saveList = async (email: string | undefined) => {
    if (!isConnected) return;
    const uid = auth.currentUser?.uid;
    let owners = [uid];

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      owners = [...owners, doc.id];
    });

    const doc = await addDoc(collection(db, 'lists'), {
      title: list,
      owners: owners,
    });
    setList('');
  };

  const addList = () => {
    if (!isConnected) return;
    if (list === '') return;
    Alert.prompt(
      'Share with user?',
      'Enter email',
      [
        {
          text: 'Skip',
          onPress: () => {
            saveList('');
          },
        },
        {
          text: 'Save',
          onPress: (text: string | undefined) => saveList(text),
        },
      ],
      'plain-text',
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.leftContainerBorder}></View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder="Add list"
            onChangeText={(text: string) => setList(text)}
            value={list}
            clearButtonMode="always"
            onBlur={() => setList('')}
            editable={isConnected}
          />
          <Button onPress={addList} title="Add" disabled={!isConnected || list === ''} />
        </View>
        {lists.length > 0 && (
          <View style={styles.itemsContainer}>
            <FlatList
              data={lists}
              renderItem={({ item }) => <List list={item} />}
              keyExtractor={(list: ListData) => list.id}
              initialNumToRender={15}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    width: 40,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingRight: 3,
  },
  leftContainerBorder: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
    width: '100%',
    height: '100%',
  },
  rightContainer: {
    flex: 1,
  },
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
    flex: 1,
    height: '100%',
  },
});

export default ListsScreen;
