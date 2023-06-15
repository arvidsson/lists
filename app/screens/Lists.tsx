import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { StackParamList } from '../../App';

export interface IList {
  id: string;
  title: string;
  owners: string[];
}

export type StackNavigation = NavigationProp<StackParamList>;

const Lists = () => {
  const [lists, setLists] = useState<IList[]>([]);
  const [list, setList] = useState('');

  const navigation = useNavigation<StackNavigation>();

  useEffect(() => {
    const listsRef = collection(db, 'lists');
    const q = query(listsRef, where("owners", "array-contains", auth.currentUser?.uid));

    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        const lists: IList[] = [];
        snapshot.docs.forEach(doc => {
          lists.push({
            id: doc.id,
            ...doc.data()
          } as IList);
        });
        setLists(lists);
      }
    });

    return () => subscriber();
  }, []);

  const addList = async () => {
    const uid = auth.currentUser?.uid;
    const doc = await addDoc(collection(db, 'lists'), { title: list, owners: [ uid ] });
    setList('');
  };

  const renderList = ({ item: list }: any) => {
    const listRef = doc(db, `lists/${list.id}`);

    const deleteList = async () => {
      deleteDoc(listRef);
    }

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.item} onPress={() => {navigation.navigate('List', { list });}}>
          <Text style={styles.itemText}>{list.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder='Add list' onChangeText={(text: string) => setList(text)} value={list} />
        <Button onPress={addList} title='Add' disabled={list === ''} />
      </View>
      { lists.length > 0 && (
        <View style={styles.itemsContainer}>
          <FlatList data={lists} renderItem={(list) => renderList(list)} keyExtractor={(list: IList) => list.id} />
        </View>
      )}
    </View>
  )
}

export default Lists

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