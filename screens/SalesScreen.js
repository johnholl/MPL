import React from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import { Card, Title, Paragraph, FAB, Avatar} from 'react-native-paper';
import { Asset } from 'expo-asset';
import {app, db} from "../config";
import dsFromTimestamp from "../utils/dates_and_times"
import firebase from "firebase";

const LeftContent = (props, icon) => <Avatar.Icon {...props} size={48} icon={icon} />;

const icons = ['solar-panel', 'solar-panel', 'water', 'stove'];




let SalesScreen;
export default SalesScreen = ({ navigation }) => {
    const { currentUser } = firebase.auth(app);

    const [sales, setSales] = React.useState(null);
    let ref = db.ref("/sales/" +currentUser.uid);


    React.useEffect(() => {
        (async function () {
            ref.orderByChild("timestamp").limitToFirst(50).on("value", function (snapshot) {
                // get children as an array
                let items = [];
                snapshot.forEach((child) => {
                    console.log(child.val());
                    items.push({...child.val(), key:child.key, uid:currentUser.uid});
                });
                setSales(items.reverse())
            });
        })();
    }, []);

    const getDetails = (sale) => {
        navigation.navigate('Details', sale)
    };


    if (!sales) {
        return(
            <View></View>
        );
    }

    return (
        <View style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            display: "flex", flex: 1}}>
            <ScrollView style={{paddingTop:10}}>
                {sales.map(sale => { return(
                    <View style={{padding:20}}>
                    <Card style={{elevation:4}}
                        onPress={() => {getDetails(sale)}}>
                        <Card.Title title={sale.itemName} subtitle="" left={(props) => {return LeftContent(props, sale.icon)}} />
                        <Card.Content>
                            <Title>Created on {dsFromTimestamp(sale.timestamp)}</Title>
                            <Paragraph>{sale.completed ? "Completed" : "Not completed"}</Paragraph>
                        </Card.Content>
                        <Card.Cover style={{padding:5, backgroundColor:'white'}} source={{ uri: sale.imgURI }} />
                        <Card.Actions>
                        </Card.Actions>
                    </Card>
                    </View>)})}
            </ScrollView>
            <View style={styles.fixedView}>
                <FAB
                    style={styles.fab}
                    color={'darkslategray'}
                    theme={{ colors: { accent: 'gold' } }}
                    icon="plus"
            onPress={() =>
            navigation.navigate('Product')
        }
            />
            </View>
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