import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import SalesScreen from "../SalesScreen";
import ProductScreen from "./ProductScreen"
import DateLocationScreen from "./DateLocationScreen"
import CongratulationsScreen from "./CongratulationsScreen"
import SaleDetailScreen from "../SaleDetail/SaleDetailScreen"
import ImgSelector from "../SaleDetail/ImgSelector"
import Survey from "../../components/Survey"
import HomeScreen from "../HomeScreen";


const Stack = createStackNavigator();

export default function SaleNavigator(props) {

    let posQuestions = props.posQuestions;

    return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen
                    name="Home"
                    component={SalesScreen}
                    options={{ title: 'Past Sales' }}
                />
                <Stack.Screen name="Product" component={ProductScreen} />
                <Stack.Screen name="DateLocation" component={DateLocationScreen} />
                <Stack.Screen name="Interview">
                    {props => <Survey {...props} questions={posQuestions} />}
                </Stack.Screen>
                <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
                <Stack.Screen name="Details" component={SaleDetailScreen} />
                <Stack.Screen name="Camera" component={ImgSelector} />
            </Stack.Navigator>
    );
}
