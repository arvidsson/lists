import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export type ItemData = {
  id: string;
  title: string;
  isDone: boolean;
}

type ItemProps = {
  item: ItemData;
}

const Item = ({ item }: ItemProps) => {
  const itemRef = doc(db, `items/${item.id}`);

  const toggleDone = async () => {
      updateDoc(itemRef, {isDone: !item.isDone});
      console.log("toggled item");
    }

  const deleteItem = async () => {
    deleteDoc(itemRef);
  }

  const editItem = () => {
    console.log("editing item");
  }

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.item} onPress={toggleDone} onLongPress={editItem}>
        <Text style={[styles.itemText, item.isDone && styles.itemDone]}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
  },
});

export default Item