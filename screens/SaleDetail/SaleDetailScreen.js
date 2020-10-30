import React, {useState, useEffect} from 'react';
import {Image, Text, View, ScrollView, Button, StyleSheet, Alert, Platform, StatusBar} from 'react-native';
import {Modal, Subheading, FAB} from 'react-native-paper'
import ImgSelector from './ImgSelector'
import {db, storage} from "../../config";
import dsFromTimestamp from "../../utils/dates_and_times";
import * as ImagePicker from "expo-image-picker";
import DeletableImage from "../../components/DeletableImage";


export default function SaleDetailScreen({ route, navigation }) {
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [urls, setUrls] = useState(route.params.urls);


    let itemRef = db.ref("/sales/" + route.params.key);
    let constRef = db.ref("/constants/");

    React.useEffect(() => {
        (async function () {
            itemRef.orderByChild("timestamp").limitToFirst(10).on("value", function (snapshot) {
                try {
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

    async function uploadImageAsync(uri, key) {
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
        const dbRef = db
            .ref('/sales/' + key + '/imgURLs').push(url);
        return url;

    }

    const handleImagePicked = async pickerResult => {
        try {
            setUploading(true);

            if (!pickerResult.cancelled) {
                let uploadUrl = await uploadImageAsync(pickerResult.uri, route.params.key);
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

        handleImagePicked(pickerResult);
    };

     const pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        handleImagePicked(pickerResult);
    };

     const renderImages = (urls) => {
         if (!(urls === undefined)) {
             let imgComponents = Object.entries(urls).map(url => <DeletableImage itemRef={itemRef} url={url}/>);
             return(imgComponents)
         }
     };

    return(
        <View style={{flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
           <View style={{paddingHorizontal: 10, height:60, flexDirection:'row', alignItems:'center',
               justifyContent:'flex-start', backgroundColor:'lightgray'}}>
               <View style={{width:150}}>
                   <Text>{'CREATED ON'}</Text>
                   <Text>{dsFromTimestamp(route.params.timestamp)}</Text>
               </View>
               <View style={{width:150}}>
                   <Text>{'BUYER'}</Text>
                   <Text>{route.params.answers['Nombre']}</Text>
               </View>
           </View>
            <View style={{paddingHorizontal: 10, height:60, alignItems:'center', flexDirection:'row',
                justifyContent:'space-between', backgroundColor:'gainsboro'}}>
            <View>
                   <Text>{'PRICE'}</Text>
                   <Text>{route.params.price + "gtq"}</Text>
               </View>
                <View>
                    <Text/>
                <Text>{"-"}</Text>
                </View>
               <View>
                   <Text>{'OWED'}</Text>
                   <Text>{route.params.owed + "gtq"}</Text>
               </View>
                <View>
                    <Text/>
                    <Text>{"="}</Text>
                </View>
               <View>
                   <Text>{'COMMISSION'}</Text>
                   <Text>{route.params.commission + "gtq"}</Text>
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
                <Text>Product Details</Text>
                    <Text>{'Items: '}</Text><Text>{route.params.itemName}</Text>
                </View>
                <Subheading>Images</Subheading>
                <View style={{alignItems: "center"}}>
                {renderImages(urls)}
                </View>
                <Button title={"Delete"} color={'red'} onPress={deleteSale}/>
            <View style={styles.fixedView}>
                <FAB icon="image-plus" onPress={showImageOptions}/>
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