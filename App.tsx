import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import List from './app/screens/List';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Lists" component={List} options={{
          contentStyle:{
            backgroundColor:'#faf47d'
          }
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}