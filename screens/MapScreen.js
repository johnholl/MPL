import React, {useState} from 'react';
import MapView, { Marker } from 'react-native-maps';
import {StyleSheet, View, Dimensions, ScrollView} from 'react-native';
import {db} from "../config";

export default function MapScreen({route, navigation}) {

    const [sales, setSales] = React.useState(null);
    let ref = db.ref("/sales");
    console.log("rendering");


    React.useEffect(() => {
        (async function () {
            ref.orderByChild("timestamp").limitToFirst(10).on("value", function (snapshot) {
                // get children as an array
                let items = [];
                snapshot.forEach((child) => {
                    console.log(child.val());
                    console.log(child.val().itemVal);
                    items.push({
                        latitude: child.val().location.latitude,
                        longitude: child.val().location.longitude,
                        _key: child.key,
                        itemVal: child.val().itemVal,
                        timestamp: child.val().timestamp,
                        completed: child.val().completed,
                    });
                });
                console.log(items);
                setSales(items)
            });
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView style={styles.mapStyle}
                    initialRegion={{
                    latitude: 15.48,
                    longitude: -90.15,
                    latitudeDelta: 5.0,
                    longitudeDelta: 5.0
                }}>
                {sales.map(sale => { return(
                    <Marker
                        coordinate={{ latitude: sale.latitude, longitude: sale.longitude }}
                        pinColor="red"
                    />
                               )})}
                <Marker
                    coordinate={{ latitude: 15.48, longitude: -90.15 }}
                    pinColor="red"
                />
            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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