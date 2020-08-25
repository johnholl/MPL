import React from 'react';
import {Text, View, Button} from 'react-native';


export default function SaleDetailScreen({ route, navigation }) {
    console.log(route);

    return(
        <View>
            <Text>Product Details</Text>
            {Object.entries(route.params).map(p => {return(<View><Text>{p[0]}</Text><Text>{p[1]}</Text></View>)})}
            <Button
                title="Take a picture"
                onPress={() =>
            {navigation.navigate('Camera')}}
                />
        </View>)
};