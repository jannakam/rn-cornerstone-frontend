import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SideMenu } from '../../components/SideMenu';
import Home from '../../screens/Home';
import Events from '../../screens/Events';
import Steps from '../../screens/Steps';
import Profile from '../../screens/Profile';
import Store from '../../screens/Store';
import EventDetail from '../../screens/EventDetail';
import { Home as HomeIcon, MapPinned, Footprints, User, Store as StoreIcon } from '@tamagui/lucide-icons';
import { Platform } from 'react-native';
import { Text } from 'tamagui';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const EventsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventsScreen" component={Events} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
    </Stack.Navigator>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerType="slide"
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "$background",
        drawerInactiveBackgroundColor: "$background",
        drawerActiveTintColor: "$color",
        drawerInactiveTintColor: "$color",
        drawerHideStatusBarOnOpen: Platform.OS === 'ios' ? true : false,
        overlayColor: "$background",
        drawerStyle: {
          backgroundColor: "$background",
          width: '60%',
        },
        sceneContainerStyle: {
          backgroundColor: "$background",
        },
      }}>
      <Drawer.Screen 
        name="Home" 
        component={Home}
        options={{
          drawerIcon: () => <HomeIcon color="$color" size="$4" />,
          drawerLabel: () => <Text color="$color">Home</Text>,
        }}
      />
      <Drawer.Screen 
        name="Events" 
        component={EventsStack}
        options={{
          drawerIcon: () => <MapPinned color="$color" size="$4" />,
          drawerLabel: () => <Text color="$color">Events</Text>,
        }}
      />
      <Drawer.Screen 
        name="Steps" 
        component={Steps}
        options={{
          drawerIcon: () => <Footprints color="$color" size="$4" />,
          drawerLabel: () => <Text color="$color">Steps</Text>,
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={Profile}
        options={{
          drawerIcon: () => <User color="$color" size="$4" />,
          drawerLabel: () => <Text color="$color">Profile</Text>,
        }}
      />
      <Drawer.Screen 
        name="Store" 
        component={Store}
        options={{
          drawerIcon: () => <StoreIcon color="$color" size="$4" />,
          drawerLabel: () => <Text color="$color">Store</Text>,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation; 

const Colors = {
    bg: '#009688',
    active: '#fff',
    inactive: '#eee',
    transparent: 'transparent',
  };