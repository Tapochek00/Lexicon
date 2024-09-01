import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfilePage from '../Pages/ProfilePage';
import CollectionsPage from '../Pages/CollectionsPage';
import CardsPage from '../Pages/CardsPage';
import LoginPage from '../Pages/LoginPage';
import SignUpPage from '../Pages/SignUpPage';
import Navbar from './Navbar';
import EditPage from '../Pages/EditPage';
import StudySession from '../Pages/StudySession';

const Stack = createNativeStackNavigator();

const Navigate = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainPage"
          component={Navbar}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfilePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Collections"
          component={CollectionsPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cards"
          component={CardsPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditPage"
          component={EditPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StudySession"
          component={StudySession}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigate;
