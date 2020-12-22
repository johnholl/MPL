import React, {useContext} from 'react';
import {Platform, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import { Button } from 'react-native-paper';
import {Asset} from "expo-asset";
import {db} from "../../config";
import {ConstantContext} from "../../providers/ConstantProvider";
import {UserContext} from "../../providers/UserProvider";
import {Poppins_300Light_Italic, Poppins_400Regular, Poppins_600SemiBold, useFonts} from "@expo-google-fonts/poppins";
import {LanguageContext} from "../../providers/LanguageProvider";


let ProductScreen;
export default ProductScreen = ({ navigation }) => {

    const {constants, pq, fq} = useContext(ConstantContext);
    let {user, totals, monthTotals, sales, level, target, monthTargets} = useContext(UserContext);
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_400Regular, Poppins_300Light_Italic
    });
    let {language, labels} = useContext(LanguageContext);

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
        {name:'10W panel', img: Asset.fromModule(require('../../assets/small_panel.jpg')).uri},
        {name:'filter', img: Asset.fromModule(require('../../assets/water_filter.jpg')).uri},
        {name:'prefilter', img: Asset.fromModule(require('../../assets/water_filter.jpg')).uri},
        {name:'estufa', img: Asset.fromModule(require('../../assets/stove.jpg')).uri}];

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
            console.log(amount);
            Object.entries(amount).map(amt => {
               totalPrice += amt[1] * otherprices[amt[0]];
               totalCommission += amt[1] * othercommissions[amt[0]];
            });

            console.log("TOTALPRICE");
            console.log(totalPrice);

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

        if(!fontsLoaded || !constants || !labels){
            return(<View></View>)
        }

    return(
        <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            alignItems: 'center', justifyContent: 'center', flex:1}}>
            <View style={{paddingLeft:0}}>
                <Text style={{fontSize:20, fontFamily:"Poppins_600SemiBold"}}>{labels.quantity}</Text>
            </View>
            {products.map((product => {return(
                <View style={{flexDirection:"row", alignItems:"center", padding:10}}>
                    <Text style={{width:200, fontFamily:"Poppins_600SemiBold"}}>{labels[product.name] + ": "}</Text>
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
                mode="contained"
                title={labels.next}
            onPress={goToLocation}>
                <Text style={{fontFamily:"Poppins_600SemiBold"}}>{labels.next}</Text>
            </Button>
            </View>
        </View>)
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
});