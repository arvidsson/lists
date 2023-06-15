import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import List from './app/screens/List';
import Login from './app/screens/Login';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Lists, { IList } from './app/screens/Lists';

export type StackParamList = {
  Login: undefined;
  Lists: undefined;
  List: { list: IList } | undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle:{
          backgroundColor:'#fbf79c'
        }
      }}>
        {user ? (
          <>
            <Stack.Screen name="Lists" component={Lists} />
            <Stack.Screen name="List" component={List} />
          </>
        ):(
          <Stack.Screen name="Login" component={Login}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}