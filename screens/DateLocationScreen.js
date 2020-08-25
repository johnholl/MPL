import React from 'react';
import {Button, Text, View} from 'react-native';
import * as Location from 'expo-location';


let DateLocationScreen;
export default DateLocationScreen = ({ route, navigation }) => {
    const [location, setLocation] = React.useState("");
    const {itemVal} = route.params;

    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(JSON.stringify(location));
        })();
    });

    return(<View>
                <Text>Passed value: {itemVal}</Text>
                <Text>Date and Location being set automatically</Text>
                <Button
                    title="Customer Questions"
                    onPress={() =>
                        navigation.navigate('Interview',
                                            {itemVal: itemVal,
                                             location: location,
                                             timestamp: Date.now()})
                    }/>
            </View>)
};