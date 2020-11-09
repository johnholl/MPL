import React, {useState} from 'react';
import {View, Platform, StatusBar, Image, Alert} from 'react-native'
import {Text, Title, Subheading, Paragraph} from 'react-native-paper';
import firebase from "firebase";
import {app, db} from '../config'
import { Feather } from '@expo/vector-icons';


export default function HomeScreen(props) {
    const { currentUser } = firebase.auth(app);
    let [errorMessage, setErrorMessage] = useState(null);

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

    if (props.constants===null) {
        return(
            <View/>      );
    }

    return(
        <View style={{backgroundColor: "#FCEEA7", paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                      display: "flex", flex: 1}}>
            {errorMessage &&
            <Text style={{ color: 'red' }}>
                {errorMessage}
            </Text>}
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
            <View style={{alignItems: "center", justifyContent: "center", flex:1}}>
                <Title style={{}}>Hi {currentUser.displayName}!</Title>
                <Title style={{}}>Sales totals:</Title>

                <View style={{}}>
                    <Subheading style={{textAlign: "left", alignSelf: 'stretch', fontWeight: 'bold'}}>5 Solar Kits</Subheading>
                    <Subheading style={{textAlign: "left", alignSelf: 'stretch', fontWeight: 'bold'}}>3 Water Filters</Subheading>
                    <Subheading style={{textAlign: "left", alignSelf: 'stretch', fontWeight: 'bold'}}>4 Cookstoves</Subheading>
                </View>
            </View>
            <View style={{alignItems: "center", justifyContent: "center", flex:.4}}>
            </View>
            </View>)
};