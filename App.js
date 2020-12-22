import React from 'react';
import { Buffer } from 'buffer';
global.Buffer = Buffer; // very important
import AuthTabs from './screens/AuthTabs';
import LoadingScreen from './screens/Authentication/LoadingScreen'
import LoginScreen from './screens/Authentication/LoginScreen'
import SignUpScreen from './screens/Authentication/SignUpScreen'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import SaleNavigator from './screens/NewSale/SaleNavigator';
import MapScreen from './screens/MapScreen'
import { NavigationContainer } from '@react-navigation/native';
import UserProvider from "./providers/UserProvider";
import ConstantProvider from "./providers/ConstantProvider";
import LanguageProvider from "./providers/LanguageProvider";
import AppLoading from 'expo-app-loading';
import { useFonts,  Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Portal } from 'react-native-paper';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  return (
      <Portal.Host>
      <ConstantProvider>
          <UserProvider>
              <LanguageProvider>
                  <>
                    <NavigationContainer>
                      <Stack.Navigator
                          screenOptions={{
                              headerShown: false
                          }}>
                          <Stack.Screen name="Loading" component={LoadingScreen} />
                          <Stack.Screen name="Login" component={LoginScreen} />
                          <Stack.Screen name="Signup" component={SignUpScreen} />
                          <Stack.Screen name="Authtabs" component={AuthTabs} />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </>
              </LanguageProvider>
          </UserProvider>
      </ConstantProvider>
      </Portal.Host>

  );
}




