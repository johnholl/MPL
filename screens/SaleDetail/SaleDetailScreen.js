import React, {useState, useEffect} from 'react';
import {Image, Text, View, ScrollView, StyleSheet, Alert, Platform, StatusBar} from 'react-native';
import {Modal, Subheading, Button, Divider, Checkbox} from 'react-native-paper'
import ImgSelector from './ImgSelector'
import {db, storage} from "../../config";
import dsFromTimestamp from "../../utils/dates_and_times";
import * as ImagePicker from "expo-image-picker";
import DeletableImage from "../../components/DeletableImage";
import PhotoGrid from 'react-native-image-grid';



export default function SaleDetailScreen(props) {
    let route = props.route;
    let navigation = props.navigation;

    let [uploading, setUploading] = useState(false);
    let [image, setImage] = useState(null);
    let [visible, setVisible] = useState(false);
    let [urls, setUrls] = useState(route.params.urls);
    let [completed, setCompleted] = useState(route.params.completed);
    let [sale, setSale] = useState(null);

    let itemRef = db.ref("/sales/" + route.params.uid + "/" + route.params.key);

    React.useEffect(() => {
        (async function () {
            itemRef.orderByChild("timestamp").on("value", function (snapshot) {
                try {
                    setSale(snapshot.val());
                    setUrls(snapshot.val().imgURLs);
                } catch(e) {console.log(e)}

            });
        })();
    }, []);

    const deleteSale = () => {
      itemRef.remove();
      navigation.navigate('Home');
    };

    const showImageOptions = () => {
        Alert.alert(
            "Add Image",
            "",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "upload image", onPress: pickImage},
                { text: "take a picture", onPress: takePhoto}

            ],
            { cancelable: true }
        );
    };

    async function toggleComplete() {
        db.ref('/sales/' + route.params.uid + "/" + route.params.key + '/completed').set(!completed);
        completed = setCompleted(!completed);
    }

    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function(e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const ref = storage
            .ref()
            .child( Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
        const snapshot = await ref.put(blob);
        // We're done with the blob, close and release it
        blob.close();
        let url = await snapshot.ref.getDownloadURL();
        db
            .ref('/sales/' + route.params.uid + "/" + route.params.key + '/imgURLs').push(url);
        return url;

    }

    const handleImagePicked = async pickerResult => {
        try {
            setUploading(true);

            if (!pickerResult.cancelled) {
                let uploadUrl = await uploadImageAsync(pickerResult.uri);
                setImage(uploadUrl);
            }
        } catch (e) {
            console.log("Upload failed, sorry :(");
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            setUploading(false);
        }
    };

    const takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        console.log("PICKER RESULT");
        console.log(pickerResult);

        handleImagePicked(pickerResult);
    };

     const pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        console.log("PICKER RESULT");
        console.log(pickerResult);

        handleImagePicked(pickerResult);
    };

     const renderImages = (urls) => {
         if (!(urls === undefined)) {
             let imgComponents = Object.entries(urls).map(url => <DeletableImage itemRef={itemRef} url={url}/>);
             return(imgComponents)
         }
     };

    if (!sale) {
        return(
            <View></View>
        );
    }

    return(
        <View style={{flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
           <View style={{paddingHorizontal: 10, height:60, flexDirection:'row', alignItems:'center',
               justifyContent:'space-between', backgroundColor:'lightgray'}}>
               <View>
                   <Text>{'CREATED ON'}</Text>
                   <Text>{dsFromTimestamp(sale.timestamp)}</Text>
               </View>
               <View>
                   <Text>{'BUYER'}</Text>
                   <Text>{sale.pos['Nombre']}</Text>
               </View>
               <View>
                   <Text>{'STATUS'}</Text>
                   <Text style={{color:!completed ? "red" : "green", width:100}}>{!completed ? "not complete" : "complete"}</Text>
               </View>
           </View>
            <View style={{paddingHorizontal: 10, height:60, alignItems:'center', flexDirection:'row',
                justifyContent:'space-between', backgroundColor:'gainsboro'}}>
            <View>
                   <Text>{'PRICE'}</Text>
                   <Text>{sale.price + "gtq"}</Text>
               </View>
                <View>
                    <Text/>
                <Text>{"-"}</Text>
                </View>
               <View>
                   <Text>{'OWED'}</Text>
                   <Text>{sale.owed + "gtq"}</Text>
               </View>
                <View>
                    <Text/>
                    <Text>{"="}</Text>
                </View>
               <View>
                   <Text>{'COMMISSION'}</Text>
                   <Text>{sale.commission + "gtq"}</Text>
               </View>
           </View>
            <View style={{ flex:1, flexDirection:'column', backgroundColor:"#FCEEA7"}}>
            <View style={{ height:120, flexDirection:'row'}}>
                <Image source={require('../../assets/LogoMPL.png')}
                       style={{flex: 1,
                           width: null,
                           height: null,
                           resizeMode: 'contain'}}/>
            </View>
                <Divider/>
                <Subheading style={{fontWeight:"bold"}}>Items</Subheading>
                <Text>{sale.itemName}</Text>
                <Divider/>
                <Subheading style={{fontWeight:"bold"}}>Surveys</Subheading>
                <View style={{justifyContent: "space-around", flexDirection:'row', paddingVertical:20}}>
                    <Button mode="contained" color="mediumblue" onPress={() =>
                    {navigation.navigate('Interview',
                        {newSale: false,
                            survey: "pos",
                            answers: sale.pos,
                            questions: props.posQuestions,
                            _id: route.params.key
                        })}}>Point of Sale</Button>
                    <Button mode="contained" color="lightblue" onPress={() =>
                    {navigation.navigate('Interview',
                        {newSale: false,
                            survey: "fu",
                            answers: sale.fu,
                            questions: props.fuQuestions,
                            _id: route.params.key
                        })}}>Follow Up </Button>
                </View>
                <Divider/>
                <View style={{paddingHorizontal:10}}>
                <View style={{ alignItems: "flex-start", flexDirection:'row', flexWrap:'wrap'}}>
                    {renderImages(urls)}
                    <View style={{padding: 10}}>
                    <Button mode="contained" icon="image-plus" color="silver" onPress={showImageOptions} title={"press me"}/>
                    </View>
                </View>
                </View>
                <Divider/>
                <View style={{justifyContent:'center', flexDirection:'row', alignItems:'center', paddingVertical:20}}>
                    <Text>Completed</Text>
                    <Checkbox color={'yellowgreen'} onPress={toggleComplete} status={completed ? 'checked' : 'unchecked' }/>
                </View>
                <View style={{justifyContent:'center', flexDirection:'row', alignItems:'center', paddingVertical:20}}>
                    <Button style={{width:100}} mode='contained' color={'tomato'} onPress={deleteSale}>delete</Button>
                </View>
            </View>
        </View>)
};

const styles = StyleSheet.create({
    fixedView : {
        position: 'absolute',
        right: 10,
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
});