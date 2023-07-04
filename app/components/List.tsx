import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../App';
import { colors } from '../Theme';
import { NetworkContext } from '../../network';

export type ListData = {
  id: string;
  title: string;
  owners: string[];
};

type ListProps = {
  list: ListData;
};

const List = ({ list }: ListProps) => {
  const { isConnected } = useContext(NetworkContext);
  const listRef = doc(db, `lists/${list.id}`);
  const navigation = useNavigation<StackNavigation>();

  const openList = () => {
    if (list.title === ' ') return;
    navigation.navigate('List', { list });
  };

  const deleteList = async () => {
    deleteDoc(listRef);
  };

  const updateTitle = (title: string) => {
    if (title === '') return;
    updateDoc(listRef, { title: title });
  };

  const editList = () => {
    if (!isConnected) return;
    Alert.prompt(
      'Edit list',
      '',
      [
        {
          text: 'Save',
          onPress: (text: string | undefined) => updateTitle(text || ''),
          style: 'default',
        },
        {
          text: 'Cancel',
          style: 'default',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteList(),
        },
      ],
      'plain-text',
      list.title,
    );
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item} onPress={openList} onLongPress={editList}>
        <Text style={styles.itemText}>{list.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lines,
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
