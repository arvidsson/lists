import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  const login = async () => {

    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        textContentType='emailAddress'
        autoCapitalize='none'
        onChangeText={setEmail}
        value={email}
      />
      <TextInput 
        style={styles.input}
        placeholder="Password"
        textContentType='password'
        autoCapitalize='none'
        secureTextEntry={true}
        onChangeText={(text: string) => setPassword(text)}
        value={password}
      />
      <Button onPress={signup} title ="Signup" />
      <Button onPress={login} title ="Login" />
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10
  },
});