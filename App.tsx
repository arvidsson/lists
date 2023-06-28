import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import ListScreen from './app/screens/ListScreen';
import LoginScreen from './app/screens/LoginScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import ListsScreen, { IList } from './app/screens/ListsScreen';

export type StackParamList = {
  Login: undefined;
  Lists: undefined;
  List: { list: IList } | undefined;
};

export type StackNavigation = NavigationProp<StackParamList>;

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
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#fbf79c',
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Lists" component={ListsScreen} />
            <Stack.Screen name="List" component={ListScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
