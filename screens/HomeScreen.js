import React, {useState, useContext} from 'react';
import {Text, View, Platform, StatusBar, Image, Alert, ScrollView} from 'react-native'
import {Title, Subheading, Divider, DataTable, ActivityIndicator} from 'react-native-paper';
import firebase from "firebase";
import {app, db} from '../config'
import { Feather } from '@expo/vector-icons';
import {UserContext} from "../providers/UserProvider";
import {LanguageContext} from "../providers/LanguageProvider";
import {Poppins_600SemiBold, useFonts} from "@expo-google-fonts/poppins";
import AppLoading from "expo-app-loading";


export default function HomeScreen(props) {
    let {user, totals, monthTotals, sales, level, target, monthTargets} = useContext(UserContext);
    let [errorMessage, setErrorMessage] = useState(null);

    let {language, labels} = useContext(LanguageContext);
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const createTwoButtonAlert = () =>
        Alert.alert(
            "Sign out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Sign out",
                    onPress: () => firebase.auth(app).signOut().catch(error => setErrorMessage(error))
                },
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ],
            { cancelable: true }
        );

    if (!fontsLoaded || props.constants===null || user===null || totals===null || monthTargets===null || labels===null || language===null) {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" />
            </View>     );
    }
    return(
        <View style={{backgroundColor: "#FFFFC0", paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                      display: "flex", flex: 1}}>
            {errorMessage &&
            <Text style={{ color: 'red' }}>
                {errorMessage}
            </Text>}
            <View style={{flex:.7}}>
            <View style={{justifyContent:'flex-end', flexDirection:'row', padding:10, flex:0.15}}>
                <View style={{justiftyContent:"center", alignItems:"center"}}>
                <Feather.Button name="log-out" backgroundColor="gray" onPress={createTwoButtonAlert} style={{justifyContent:'center', alignItems:'center'}}>
                </Feather.Button>
                </View>
            </View>
            <View style={{flexDirection: 'row', flex:.8}}>
                    <Image source={require('../assets/LogoMPL.png')}
                           style={{flex: 1,
                                    width: null,
                                    height: null,
                                    resizeMode: 'contain'}}/>
            </View>
            </View>
            <View style={{flex:1}}>
                <Divider/>
            <ScrollView>
                <View style={{flexDirection:"row", paddingTop: 50}}>
                    <Subheading style={{fontWeight:"bold", padding:10}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["monthLabel"]}</Text></Subheading>
                </View>

                <DataTable style={{paddingHorizontal: 30, paddingBottom: 50}}>
                    <DataTable.Header>
                        <DataTable.Title><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["items"]}</Text></DataTable.Title>
                        <DataTable.Title numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["sold"]}</Text></DataTable.Title>
                        <DataTable.Title numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["goal"]}</Text></DataTable.Title>

                    </DataTable.Header>
                    {Object.entries(monthTotals).map(tot => {
                        if(tot[0] !== "total") {
                            return (
                                <DataTable.Row>
                                    <DataTable.Cell><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels[tot[0]]}</Text></DataTable.Cell>
                                    <DataTable.Cell numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{tot[1]}</Text></DataTable.Cell>
                                    <DataTable.Cell numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{monthTargets[tot[0]]}</Text></DataTable.Cell>

                                </DataTable.Row>
                            )
                        }
                    })}
                </DataTable>


                <View style={{flexDirection:"row"}}>
                    <Subheading style={{fontWeight:"bold", padding:10}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["allTimeLabel"]}</Text></Subheading>
                </View>

                <DataTable style={{paddingHorizontal: 30}}>
                    <DataTable.Header>
                        <DataTable.Title><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["items"]}</Text></DataTable.Title>
                        <DataTable.Title numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["sold"]}</Text></DataTable.Title>
                    </DataTable.Header>
                    {Object.entries(totals).map(tot => {
                        return(
                            <DataTable.Row>
                                <DataTable.Cell><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels[tot[0]]}</Text></DataTable.Cell>
                                <DataTable.Cell numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{tot[1]}</Text></DataTable.Cell>
                            </DataTable.Row>
                        )
                    })}
                    <DataTable.Row>
                        <DataTable.Cell><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels["goal"]}</Text></DataTable.Cell>
                        <DataTable.Cell numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{target}</Text></DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </ScrollView>
            </View>
            </View>)
};