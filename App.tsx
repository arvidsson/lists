import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import ListScreen from './app/screens/ListScreen';
import LoginScreen from './app/screens/LoginScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import ListsScreen from './app/screens/ListsScreen';
import { ListData } from './app/components/List';
import { colors } from './app/Theme';

export type StackParamList = {
  Login: undefined;
  Lists: undefined;
  List: { list: ListData } | undefined;
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
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
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
