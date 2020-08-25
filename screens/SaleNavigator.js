import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import SalesScreen from "./SalesScreen";
import ProductScreen from "./ProductScreen"
import DateLocationScreen from "./DateLocationScreen"
import InterviewScreen from "./InterviewScreen"
import CongratulationsScreen from "./CongratulationsScreen"
import SaleDetailScreen from "./SaleDetailScreen"
import ImgSelector from "./ImgSelector"


const Stack = createStackNavigator();

export default function SaleNavigator() {

    return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={SalesScreen}
                    options={{ title: 'Past Sales' }}
                />
                <Stack.Screen name="Product" component={ProductScreen} />
                <Stack.Screen name="DateLocation" component={DateLocationScreen} />
                <Stack.Screen name="Interview" component={InterviewScreen} />
                <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
                <Stack.Screen name="Details" component={SaleDetailScreen} />
                <Stack.Screen name="Camera" component={ImgSelector} />
            </Stack.Navigator>
    );
}
