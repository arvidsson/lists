import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../App';
import Ionicons from '@expo/vector-icons/Ionicons';

export type ListData = {
  id: string;
  title: string;
  owners: string[];
};

type ListProps = {
  list: ListData;
};

const List = ({ list }: ListProps) => {
  const listRef = doc(db, `lists/${list.id}`);
  const navigation = useNavigation<StackNavigation>();

  const deleteList = async () => {
    deleteDoc(listRef);
  };

  const deleteAlert = () => {
    const message = `Delete ${list.title}?`;
    Alert.alert(message, '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => deleteList() },
    ]);
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          // skip empty items
          if (list.title === ' ') return;
          navigation.navigate('List', { list });
        }}
      >
        <Text style={styles.itemText}>{list.title}</Text>
      </TouchableOpacity>
      {list.title !== ' ' && (
        <Ionicons name="trash-outline" size={20} color="grey" onPress={deleteAlert} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8296a1',
    paddingRight: 10,
  },
  item: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemText: {
    fontFamily: 'Noteworthy',
    fontSize: 28,
  },
});

export default List;
