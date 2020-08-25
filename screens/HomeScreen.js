import React from 'react';
import {Button, Text, View} from 'react-native';


export default function HomeScreen({ route, navigation }) {
    console.log(route);

    return(
        <View>
            <Text>Hi John!</Text>
            <Text>Solar kits sold: 5</Text>
            <Text>Water filters sold: 3</Text>
            <Text>Cookstoves sold: 4</Text>
        </View>)
};