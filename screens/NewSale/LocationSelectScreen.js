import React, {useState, useContext} from 'react';
import MapView, { Marker } from 'react-native-maps';
import {StyleSheet, View, Dimensions, Text, Platform, StatusBar} from 'react-native';
import {db} from "../../config";
import * as Location from "expo-location";
import {Button} from "react-native-paper";
 import {LanguageContext} from "../../providers/LanguageProvider";

export default function LocationSelectScreen({route, navigation}) {
    console.log("Did we make it here?");
    const [location, setLocation] = React.useState(null);

    let {language, labels} = useContext(LanguageContext);


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

    if(!location){
        return(
            <View></View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{flex:0.1, paddingTop:10}}>
                <Text>
                    {labels.mapInstructions}
                </Text>
            </View>
            <View style={{flex:1}}>
            <MapView style={styles.mapStyle}
                     initialRegion={{
                         latitude: location.latitude,
                         longitude: location.longitude,
                         latitudeDelta: 5.0,
                         longitudeDelta: 5.0
                     }}>
                <Marker draggable
                        coordinate={{latitude: location.latitude, longitude: location.longitude}}
                        onDragEnd={(e) => setLocation({latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude })}
                />
            </MapView>
            </View>
            <View style={{flex:0.1}}>
                <Button mode="contained" color="green" onPress={
                    () => navigation.navigate('Interview', {...route.params , location:location})} title={labels.next}>
                    Next
                </Button>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});