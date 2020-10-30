import React, {useState} from 'react';
import 'react-native-gesture-handler';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import SaleNavigator from "./NewSale/SaleNavigator";
import HomeScreen from "./HomeScreen"
import MapScreen from "./MapScreen";
import {db} from "../config";



const Tab = createMaterialBottomTabNavigator();

export default function AuthTabs(props) {

    let [constants, setConstants] = useState(null);
    let [posQuestions, setPosQuestions] = useState({});
    let [fuQuestions, setFuQuestions] = useState({});

    React.useEffect( () => {
        let constRef = db.ref("/constants");

        constRef.on("value", function (snapshot) {
                let cons = [];
                snapshot.forEach((child) => {
                    cons.push({title: child.key, value: child.val().constVal});
                });
                setConstants(cons)});

            let posQuestionRef = db.ref("/questions/pos");
            let fuQuestionRef = db.ref("/questions/fu");
            posQuestionRef.on("value", function (snapshot) {
                // get children as an array
                let posqs = [];
                snapshot.forEach((child) => {
                    posqs.push(child.val());
                });
                setPosQuestions(posqs);
            });

            fuQuestionRef.on("value", function (snapshot) {
                // get children as an array
                let fuqs = [];
                snapshot.forEach((child) => {
                    fuqs.push(child.val());
                });
                setFuQuestions(fuqs);
            });
    }, []);

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home'
                    } else if (route.name === 'Sales') {
                        iconName = 'book';
                    }
                    else if (route.name === 'Map') {
                        iconName = 'eye';
                    }

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={20} color={color} />;
                },
            })}>
            <Tab.Screen name="Home">
                {props => <HomeScreen {...props} constants={constants} />}
            </Tab.Screen>
            <Tab.Screen name="Sales">
                {props => <SaleNavigator {...props} constants={constants}
                                         posQuestions={posQuestions} fuQuestions={fuQuestions} />}
            </Tab.Screen>
            <Tab.Screen name="Map">
                {props => <MapScreen {...props} constants={constants} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}
