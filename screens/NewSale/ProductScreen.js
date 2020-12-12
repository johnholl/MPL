import React, {useContext} from 'react';
import {Button, Platform, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {Asset} from "expo-asset";
import {db} from "../../config";
import {ConstantContext} from "../../providers/ConstantProvider";
import {UserContext} from "../../providers/UserProvider";


let ProductScreen;
export default ProductScreen = ({ navigation }) => {

    const {constants, pq, fq} = useContext(ConstantContext);
    let {user, totals, monthTotals, sales, level, target, monthTargets} = useContext(UserContext);

    const otherprices = {"10W panel": constants['Precio de 10W'],
                         "filter": constants['Precio de Filtro'],
                         "prefilter": constants['Precio de Prefiltro'],
                         "estufa": constants['Precio de Estufa']};

    const othercommissions = {"10W panel": constants['Comisión Nivel ' + level +  ' 10W'],
        "filter": constants['Comisión Nivel ' + level +  ' Filtros'],
        "prefilter": constants['Comisión Nivel ' + level +  ' Prefiltros'],
        "estufa": constants['Comisión Nivel ' + level +  ' Estufas']};

    const [value, setValue] = React.useState('0');
    const [amount, setAmount] = React.useState({});

    const products = [
        {name:"10W panel", img: Asset.fromModule(require('../../assets/small_panel.jpg')).uri},
        {name:"filter", img: Asset.fromModule(require('../../assets/water_filter.jpg')).uri},
        {name:"prefilter", img: Asset.fromModule(require('../../assets/water_filter.jpg')).uri},
        {name:"estufa", img: Asset.fromModule(require('../../assets/stove.jpg')).uri}];

    let prices = [];
    let commissions = [];
    let owed = [];

        db.ref("/constants").once('value',
        (snapshot) =>{
            prices = [snapshot.child('Precio de 10W/constVal').val(),
                snapshot.child('Precio de Filtro/constVal').val(),
                snapshot.child('Precio de Estufa/constVal').val()];

            commissions = [snapshot.child('Comisión Nivel 1 10W/constVal').val(),
                snapshot.child('Comisión Nivel 1 Filtros/constVal').val(),
                snapshot.child('Comisión Nivel 1 Estufas/constVal').val()];

            owed = prices.map(function(v,i) {return (v - commissions[i]); });

        });

        function goToLocation() {
            let totalPrice = 0;
            let totalCommission = 0;
            Object.entries(amount).map(amt => {
               totalPrice += amt[1] * otherprices[amt[0]];
               totalCommission += amt[1] * othercommissions[amt[0]];
            });

            navigation.navigate('LocationSelect',
                {itemVal: value,
                    timestamp: Date.now(),
                    newSale: true,
                    price: Math.round((totalPrice + Number.EPSILON) * 100) / 100,
                    commission: Math.round((totalCommission + Number.EPSILON) * 100) / 100,
                    owed: Math.round((totalPrice - totalCommission + Number.EPSILON) * 100) / 100,
                    amounts: amount
                })
        }

    return(
        <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            alignItems: 'center', justifyContent: 'center', flex:1}}>
            <View style={{paddingLeft:0}}>
                <Text style={{fontSize:20}}>Quantities:</Text>
            </View>
            {products.map((product => {return(
                <View style={{flexDirection:"row", alignItems:"center", padding:10}}>
                    <Text style={{width:200}}>{product.name + ": "}</Text>
                    <TextInput
                        keyboardType={"numeric"}
                        style={{height: 20, borderColor: 'gray', borderWidth: 1}}
                        defaultValue={0}
                        placeholder={"0"}
                        onChangeText={text => {
                            setAmount({...amount, [product.name]: Number(text)})
                        }}
                        value={amount[product[0]]}/>
                </View>)
            }))}

            <View style={{width:'100%', padding:20}}>
            <Button
                color={'green'}
            title="Next"
            onPress={goToLocation}/>
            </View>
        </View>)
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
});