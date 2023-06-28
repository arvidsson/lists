import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    // skip empty items
    if (item.title === ' ') return;

    updateDoc(itemRef, { isDone: !item.isDone });
    console.log('toggled item');
  };

  const deleteItem = async () => {
    deleteDoc(itemRef);
  };

  const editItem = () => {
    console.log('editing item');
    setEditing(true);
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item} onPress={toggleDone} onLongPress={editItem}>
        <Text
          style={[styles.itemText, item.isDone && styles.itemDone, editing && styles.itemEditing]}
        >
          {item.title}
        </Text>
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
    paddingLeft: 30,
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
  itemEditing: {
    color: '#ff00ff',
  },
});

export default Item;
