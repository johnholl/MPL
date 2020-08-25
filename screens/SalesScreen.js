import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, FAB, Avatar} from 'react-native-paper';
import { Asset } from 'expo-asset';
import { db } from "../config";
import dsFromTimestamp from "../utils/dates_and_times"

const LeftContent = (props, icon) => <Avatar.Icon {...props} size={48} icon={icon} />;

const smallPanelImg = Asset.fromModule(require('../assets/small_panel.jpg')).uri;
const largePanelImg = Asset.fromModule(require('../assets/large_panel.jpg')).uri;
const waterFilterImg = Asset.fromModule(require('../assets/water_filter.jpg')).uri;
const stoveImg = Asset.fromModule(require('../assets/stove.jpg')).uri;
const imgs = [smallPanelImg, largePanelImg, waterFilterImg, stoveImg];
const icons = ['solar-panel', 'solar-panel', 'water', 'stove'];




let SalesScreen;
export default SalesScreen = ({ navigation }) => {
    const [sales, setSales] = React.useState(null);
    let ref = db.ref("/sales");
    console.log("rendering");


    React.useEffect(() => {
        (async function () {
            ref.orderByChild("timestamp").limitToFirst(10).on("value", function (snapshot) {
                // get children as an array
                let items = [];
                snapshot.forEach((child) => {
                    items.push({
                        name: child.val().name,
                        itemName: child.val().itemName,
                        _key: child.key,
                        itemVal: child.val().itemVal,
                        timestamp: child.val().timestamp,
                        imgURI: imgs[child.val().itemVal],
                        icon: icons[child.val().itemVal],
                        completed: child.val().completed,
                    });
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
        <View style={{flex: 1}}>
            <ScrollView>
                {sales.map(sale => { return(
                    <Card onPress={() => {getDetails(sale)}}>
                        <Card.Title title={sale.itemName} subtitle="" left={(props) => {return LeftContent(props, sale.icon)}} />
                        <Card.Content>
                            <Title>Created on {dsFromTimestamp(sale.timestamp)}</Title>
                            <Paragraph>{sale.completed ? "Completed" : "Not completed"}</Paragraph>
                        </Card.Content>
                        <Card.Cover source={{ uri: sale.imgURI }} />
                        <Card.Actions>
                        </Card.Actions>
                    </Card>            )})}
            </ScrollView>
            <View style={styles.fixedView}>
                <FAB
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