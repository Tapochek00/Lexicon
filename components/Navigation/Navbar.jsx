import {StyleSheet} from 'react-native';
import React from 'react';
import {purp, screenHeight} from '../../globals/gstyles';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather'
import Octicons from 'react-native-vector-icons/Octicons'
import FoldersPage from '../Pages/FoldersPage';
import ProfilePage from '../Pages/ProfilePage';
import AddPage from '../Pages/AddPage';
import SearchPage from '../Pages/SearchPage';
import StudySession from '../Pages/StudySession';
import SetStudySession from '../Pages/SetStudySession';
import SettingsPage from '../Pages/SettingsPage';

const Tab = createBottomTabNavigator();

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: style.container,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Cards"
        component={FoldersPage}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="cards-outline"
              size={30}
              color="white"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Feather name="search" size={30} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="SetStudySession"
        component={SetStudySession}
        options={{
          headerShown: false,
          tabBarIcon: () => <Octicons name="book" size={30} color="white" />,
        }}
      />
      <Tab.Screen
        name="AddPage"
        component={AddPage}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Octicons name="diff-added" size={30} color="white" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          headerShown: false,
          tabBarIcon: () => <Feather name="user" size={30} color="white" />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          headerShown: false,
          tabBarIcon: () => <Feather name="settings" size={30} color="white" />,
        }}
      />
    </Tab.Navigator>
  );
};

const style = StyleSheet.create({
  container: {
    height: screenHeight / 13,
    backgroundColor: purp,
    paddingBottom: 5,
  },
});

export default Navbar;
