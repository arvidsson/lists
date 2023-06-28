import { View, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // how to signup; I will currently handle that manually in firebase
  const signup = async () => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          textContentType="emailAddress"
          autoCapitalize="none"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          textContentType="password"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
        />
      </View>
      <Button onPress={login} title="Login" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;
