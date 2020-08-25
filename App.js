import React from 'react';
import { Buffer } from 'buffer';
global.Buffer = Buffer; // very important
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import SaleNavigator from './screens/SaleNavigator';
// import MapScreen from './screens/MapScreen'
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
      <>
        <NavigationContainer>
          <Drawer.Navigator>
              <Drawer.Screen name="Sales" component={SaleNavigator} />
              <Drawer.Screen name="Home" component={HomeScreen} />
              {/*<Drawer.Screen name="Map" component={MapScreen} />*/}
          </Drawer.Navigator>
        </NavigationContainer>

      </>
  );
}