import React, {useContext, useState, useEffect} from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {Card, Title, Paragraph, FAB, Avatar, Text, RadioButton, ActivityIndicator} from 'react-native-paper';
import {app, db} from "../config";
import dsFromTimestamp from "../utils/dates_and_times"
import {UserContext} from "../providers/UserProvider";
import {LanguageContext} from "../providers/LanguageProvider";
import {Poppins_600SemiBold, Poppins_400Regular, Poppins_300Light_Italic, useFonts} from "@expo-google-fonts/poppins";

const LeftContent = (props, complete) => <Avatar.Icon {...props} size={48} style={complete ? {backgroundColor: "lightgreen"} : {backgroundColor: "lightcoral"}} />;

let SalesScreen;
export default SalesScreen = (props) => {
    let monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setHours(0, 0, 0);
    monthAgo.setMilliseconds(0);
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_400Regular, Poppins_300Light_Italic
    });

    let {user, totals, monthTotals, sales, level, target} = useContext(UserContext);

    const [displaySales, setDisplaySales] = useState([]);
    const [filter, setFilter] = React.useState('all');
    let [loading, setLoading] = useState(false);
    let {language, labels} = useContext(LanguageContext);


    const filterfunc = (sale) => {
        if(filter==="complete") {
            return sale.completed;
        }
        else if(filter==="incomplete") {
            return !sale.completed;
        }
        else if (filter==='30'){
            return sale.timestamp > monthAgo;
        }
        else {
            return true
        }
    };


    const getDetails = (sale) => {
        props.navigation.navigate('Details', sale)
    };


    if (!sales || !displaySales || !fontsLoaded) {
        return(
            <View></View>
        );
    }

    return (
        <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            display: "flex", flex: 1}}>
            <View style={{flex:1}}>
                <ScrollView style={{backgroundColor:"#FFFFC0"}}>
                    <View style={{padding:20}}>
                        <RadioButton.Group onValueChange={newValue => {setFilter(newValue)}} value={filter}>
                            <RadioButton.Item color="#2160A7" label={<Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["all"]}</Text>} value="all" />
                            <RadioButton.Item color="#2160A7" label={<Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["lastMonth"]}</Text>} value="30" />
                            <RadioButton.Item color="#2160A7" label={<Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["complete"]}</Text>} value="complete" />
                            <RadioButton.Item color="#2160A7" label={<Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["notComplete"]}</Text>} value="incomplete" />
                        </RadioButton.Group>
                    </View>
                    {sales.filter(filterfunc).map(sale => { return(
                        <View style={{padding:10}}>
                            <Card style={{elevation:4, backgroundColor:"#FFFFDA"}}
                                  onPress={() => {getDetails(sale)}}>
                                <Card.Title title={<Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.clientTitle + ": " + sale.pos?.Nombre}</Text>} subtitle="" left={(props) => {return LeftContent(props, sale.completed)}} />
                                <Card.Content>
                                    <Title>{<Text style={{ fontFamily: 'Poppins_400Regular' }}>{labels.createdOn + ": " +  dsFromTimestamp(sale.timestamp)}</Text>}</Title>
                                    <Paragraph><Text style={{ fontFamily: 'Poppins_300Light_Italic' }}>{sale.completed ? labels.completed : labels.notCompleted}</Text></Paragraph>
                                </Card.Content>
                                <Card.Actions>
                                </Card.Actions>
                            </Card>
                        </View>)})}
                </ScrollView>
            </View>
            <View style={styles.fixedView}>
                <FAB
                    style={styles.fab}
                    color={'#020202'}
                    theme={{ colors: { accent: '#98CEEA' } }}
                    icon="plus"
            onPress={() =>
            props.navigation.navigate('Product')
        }
            />
            </View>
            {loading &&
            <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size='large' />
            </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fixedView : {
        position: 'absolute',
        right: 10,
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    scroll: {
        position: 'relative'
    }
});