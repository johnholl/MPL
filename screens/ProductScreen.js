import React from 'react';
import {Button, Text, View} from 'react-native';
import { RadioButton } from 'react-native-paper';
import * as Location from "expo-location";

const labels = ["40W panel", "100W panel", "Water filter", "Cookstove"];

let ProductScreen;
export default ProductScreen = ({ navigation }) => {
    const [value, setValue] = React.useState('0');
    const [itemName, setItemName] = React.useState('');
    const [location, setLocation] = React.useState({latitude: 0.0,
                                                              longitude: 0.0,
                                                              accuracy: 0});

    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }

            let loc = await Location.getCurrentPositionAsync({});
            console.log(loc);
            setLocation({latitude: loc.coords.latitude,
                               longitude: loc.coords.longitude,
                               accuracy: loc.coords.accuracy,});
        })();
    }, []);

    const onChangeItem = (value) => {
        setValue(value);
        setItemName(labels[value]);
    };

    return(
        <View>
            <Text>This is where you select your product</Text>
            <RadioButton.Group onValueChange={onChangeItem} value={value}>
                <RadioButton.Item label={labels[0]} value="0" />
                <RadioButton.Item label={labels[1]} value="1" />
                <RadioButton.Item label={labels[2]} value="2" />
                <RadioButton.Item label={labels[3]} value="3" />
            </RadioButton.Group>
            <Button
            title="Date and Location"
            onPress={() =>
            {navigation.navigate('Interview',
                    {itemVal: value,
                        location: location,
                        timestamp: Date.now(),
                        itemName: itemName,})}
                        }/>
        </View>)
};