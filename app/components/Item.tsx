import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { colors } from '../Theme';

export type ItemData = {
  id: string;
  title: string;
  isDone: boolean;
};

type ItemProps = {
  item: ItemData;
};

const Item = ({ item }: ItemProps) => {
  const [editing, setEditing] = useState(false);
  const itemRef = doc(db, `items/${item.id}`);

  const toggleDone = async () => {
    if (item.title === ' ') return;
    updateDoc(itemRef, { isDone: !item.isDone });
  };

  const deleteItem = async () => {
    deleteDoc(itemRef);
  };

  const updateTitle = (title: string) => {
    if (title === '') return;
    updateDoc(itemRef, { title: title });
  };

  const editAlert = () => {
    const message = `Edit item`;
    Alert.prompt(
      message,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Save',
          onPress: (text: string | undefined) => updateTitle(text || ''),
        },
      ],
      'plain-text',
      item.title,
    );
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item} onPress={toggleDone} onLongPress={editAlert}>
        <Text style={[styles.itemText, item.isDone && styles.itemDone]}>{item.title}</Text>
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
  itemDone: {
    textDecorationLine: 'line-through',
    color: colors.strike,
  },
});

export default Item;
