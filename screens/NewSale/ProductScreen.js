import React from 'react';
import {Button, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import { RadioButton } from 'react-native-paper';
import * as Location from "expo-location";
import {Asset} from "expo-asset";
import {db} from "../../config";

const labels = ["10W panel", "30W panel", "Water filter", "Cookstove"];

let ProductScreen;
export default ProductScreen = ({ navigation }) => {
    const [value, setValue] = React.useState('0');
    const [itemName, setItemName] = React.useState('');
    const [location, setLocation] = React.useState({latitude: 0.0,
                                                              longitude: 0.0,
                                                              accuracy: 0});

    const smallPanelImg = Asset.fromModule(require('../../assets/small_panel.jpg')).uri;
    const largePanelImg = Asset.fromModule(require('../../assets/large_panel.jpg')).uri;
    const waterFilterImg = Asset.fromModule(require('../../assets/water_filter.jpg')).uri;
    const stoveImg = Asset.fromModule(require('../../assets/stove.jpg')).uri;
    const imgs = [smallPanelImg, largePanelImg, waterFilterImg, stoveImg];

    let prices = [];
    let commissions = [];
    let owed = [];

        db.ref("/constants").once('value',
        (snapshot) =>{
            prices = [snapshot.child('Precio de 10W/constVal').val(),
                snapshot.child('Precio de 30W/constVal').val(),
                snapshot.child('Precio de Filtro/constVal').val(),
                snapshot.child('Precio de Estufa/constVal').val()];

            commissions = [snapshot.child('Comisión Nivel 1 10W/constVal').val(),
                snapshot.child('Comisión Nivel 1 30W/constVal').val(),
                snapshot.child('Comisión Nivel 1 Filtros/constVal').val(),
                snapshot.child('Comisión Nivel 1 Estufas/constVal').val()];

            owed = prices.map(function(v,i) {return (v - commissions[i]); });

        });

    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }

            let loc = await Location.getCurrentPositionAsync({});
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
        <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            alignItems: 'center', justifyContent: 'center', flex:1}}>
            <View style={{paddingLeft:0}}>
                <Text style={{fontSize:20}}>Select Product:</Text>
            </View>
            <View style={{    alignItems: 'center', justifyContent: 'center'}}>
            <RadioButton.Group onValueChange={onChangeItem} value={value}>
                <RadioButton.Item label={labels[0]} value="0" />
                <RadioButton.Item label={labels[1]} value="1" />
                <RadioButton.Item label={labels[2]} value="2" />
                <RadioButton.Item label={labels[3]} value="3" />
            </RadioButton.Group>
            </View>
            <View style={{width:'100%', padding:20}}>
            <Button
                color={'green'}
            title="Next"
            onPress={() =>
            {navigation.navigate('LocationSelect',
                    {itemVal: value,
                        location: location,
                        timestamp: Date.now(),
                        itemName: itemName,
                        newSale: true,
                        imgURI: imgs[value],
                        price: prices[value],
                        commission: commissions[value],
                        owed: owed[value]
                    })}
                        }/>
            </View>
        </View>)
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
});