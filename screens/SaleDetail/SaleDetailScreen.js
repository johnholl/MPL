import React, {useState, useEffect, useContext} from 'react';
import {Image, Text, View, ScrollView, StyleSheet, Alert, Platform, StatusBar} from 'react-native';
import {Modal, Subheading, Button, Divider, Checkbox, DataTable, ActivityIndicator} from 'react-native-paper'
import ImgSelector from './ImgSelector'
import {db, storage} from "../../config";
import dsFromTimestamp from "../../utils/dates_and_times";
import * as ImagePicker from "expo-image-picker";
import DeletableImage from "../../components/DeletableImage";
import PhotoGrid from 'react-native-image-grid';
import {LanguageContext} from "../../providers/LanguageProvider";
import {ConstantContext} from "../../providers/ConstantProvider";
import {Poppins_300Light_Italic, Poppins_400Regular, Poppins_600SemiBold, useFonts} from "@expo-google-fonts/poppins";



export default function SaleDetailScreen(props) {
    let route = props.route;
    let navigation = props.navigation;
    const {language, labels} = useContext(LanguageContext);
    const {constants, pq, fq} = useContext(ConstantContext);
    const productPrices = {"10W panel": constants['Precio de 10W'],
        "filter": constants['Precio de Filtro'],
        "prefilter": constants['Precio de Prefiltro'],
        "estufa": constants['Precio de Estufa']};

    const [uploading, setUploading] = useState(false);
    let [visible, setVisible] = useState(false);
    let [urls, setUrls] = useState([]);
    let [paymentUrl, setPaymentUrl] = useState();
    let [completed, setCompleted] = useState(route.params.completed);
    let [sale, setSale] = useState(null);
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_400Regular, Poppins_300Light_Italic
    });

    let itemRef = db.ref("/sales/" + route.params.uid + "/" + route.params.key);

    React.useEffect(() => {
        (async function () {
            itemRef.orderByChild("timestamp").on("value", function (snapshot) {
                try {
                    setSale(snapshot.val());
                    setUrls(snapshot.val().imgURLs);
                    setPaymentUrl(snapshot.val().paymentUrl);
                } catch(e) {console.log(e)}

            });
        })();
    }, []);

    const deleteSale = () => {
      itemRef.remove();
      navigation.navigate('Home');
    };

    const showImageOptions = (isPayment) => {
        if(!completed) {
            let title = isPayment ? labels.completeInstructions : labels.addPhoto;
            Alert.alert(
                title,
                "",
                [
                    {
                        text: labels.cancel,
                        style: "cancel"
                    },
                    {text: labels.uploadPhoto, onPress: () => pickImage(isPayment)},
                    {text: labels.takePhoto, onPress: () => takePhoto(isPayment)}

                ],
                {cancelable: true}
            );
        }
    };

    async function toggleComplete() {
        db.ref('/sales/' + route.params.uid + "/" + route.params.key + '/completed').set(!completed);
        completed = setCompleted(!completed);
    }

    async function uploadImageAsync(uri, isPayment) {
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
        db.ref('/sales/' + route.params.uid + "/" + route.params.key + '/imgURLs').push(url);
        if(isPayment) {
            db.ref('/sales/' + route.params.uid + "/" + route.params.key + '/paymentUrl').push(url);
            setPaymentUrl(url);
            setCompleted(true);
            db.ref('/sales/' + route.params.uid + "/" + route.params.key + '/completed').set(true);}
        return url;

    }

    const handleImagePicked = async (pickerResult, isPayment) => {
        try {
            setUploading(true);

            if (!pickerResult.cancelled) {
                let uploadUrl = await uploadImageAsync(pickerResult.uri, isPayment);
                // isPayment? setPaymentImage(uploadUrl) : setImage(uploadUrl);
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            setUploading(false);
        }
    };

    const takePhoto = async (isPayment) => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        handleImagePicked(pickerResult, isPayment);
    };

     const pickImage = async (isPayment) => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        handleImagePicked(pickerResult, isPayment);
    };

     const renderImages = (urls) => {
         if (!(urls === undefined)) {
             let imgComponents = Object.entries(urls).map(url =>
                 <View style={{padding:5}}><DeletableImage itemRef={itemRef} url={url} payment={false}/></View>);
             return(imgComponents)
         }
     };

    const deleteAlert = () => {
        Alert.alert(
            labels["sure"],
            labels["deleteSale"],
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: deleteSale}
            ],
            { cancelable: true }
        );
    };

    if (!sale || !productPrices || !fontsLoaded) {
        return(
            <View><ActivityIndicator/></View>
        );
    }

    return(
        <View style={{flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
           <View style={{paddingHorizontal: 10, height:60, flexDirection:'row', alignItems:'center',
               justifyContent:'space-between', backgroundColor:'lightgray'}}>
               <View>
                   <Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{dsFromTimestamp(sale.timestamp)}</Text>
               </View>
               <View>
                   <Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{sale.pos?.Nombre}</Text>
               </View>
               <View>
                   <Text style={{fontFamily: 'Poppins_600SemiBold', color:!completed ? "red" : "green", width:100}}>{!completed ? labels['notCompleted'] : labels['completed']}</Text>
               </View>
           </View>
            <View style={{ flex:1, flexDirection:'column', backgroundColor:"#FCEEA7"}}>
                <Divider/>
                <ScrollView>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                        <View style={{flex:2}}>
                            <DataTable style={{paddingHorizontal: 30}}>
                                <DataTable.Header>
                                    <DataTable.Title style={{flex:2}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.items}</Text></DataTable.Title>
                                    <DataTable.Title numeric></DataTable.Title>
                                    <DataTable.Title></DataTable.Title>
                                    <DataTable.Title style={{flex:2}} numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.price}</Text></DataTable.Title>
                                </DataTable.Header>
                                {Object.entries(sale.amounts).map(amount => {
                                    return(
                                        <DataTable.Row>
                                            <DataTable.Cell style={{flex:2}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{amount[0]}</Text></DataTable.Cell>
                                            <DataTable.Cell numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{"x "}</Text></DataTable.Cell>
                                            <DataTable.Cell ><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{amount[1]}</Text></DataTable.Cell>
                                            <DataTable.Cell style={{flex:2}} numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{"Q" + amount[1]*productPrices[amount[0]]}</Text></DataTable.Cell>
                                        </DataTable.Row>
                                    )
                                })}
                                <DataTable.Row>
                                    <DataTable.Cell style={{flex:2}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.total}</Text></DataTable.Cell>
                                    <DataTable.Cell numeric>{" "}</DataTable.Cell>
                                    <DataTable.Cell numeric>{" "}</DataTable.Cell>
                                    <DataTable.Cell style={{flex:2}} numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{"Q" + sale.price}</Text></DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                    <DataTable.Cell style={{flex:2}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.owed}</Text></DataTable.Cell>
                                    <DataTable.Cell numeric>{" "}</DataTable.Cell>
                                    <DataTable.Cell numeric><Text style={{color:"red", fontFamily: 'Poppins_600SemiBold'}}>{" -   "}</Text></DataTable.Cell>
                                    <DataTable.Cell style={{flex:2}} numeric><Text style={{color:"red", fontFamily: 'Poppins_600SemiBold'}}>{"Q" + sale.owed}</Text></DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                    <DataTable.Cell style={{flex:2}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.commission}</Text></DataTable.Cell>
                                    <DataTable.Cell numeric>{" "}</DataTable.Cell>
                                    <DataTable.Cell numeric>{" "}</DataTable.Cell>
                                    <DataTable.Cell style={{flex:2}} numeric><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{"Q" + sale.commission}</Text></DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        </View>
                    </View>


                <Divider/>
                <Subheading style={{fontWeight:"bold", padding:10, fontFamily:'Poppins_600SemiBold'}}>{labels.surveySection}</Subheading>
                <View style={{justifyContent: "space-around", flexDirection:'row', paddingVertical:20}}>
                    <Button mode="contained" color="mediumblue" onPress={() =>
                    {navigation.navigate('Interview',
                        {newSale: false,
                            survey: "pos",
                            answers: sale.pos,
                            questions: props.posQuestions,
                            _id: route.params.key
                        })}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.pos}</Text></Button>
                    <Button mode="contained" color="lightblue" onPress={() =>
                    {navigation.navigate('Interview',
                        {newSale: false,
                            survey: "fu",
                            answers: sale.fu,
                            questions: props.fuQuestions,
                            _id: route.params.key
                        })}}><Text style={{ fontFamily: 'Poppins_600SemiBold' }}>{labels.fu}</Text></Button>
                </View>
                <Divider/>
                <View style={{flexDirection:"row", alignItems:"center", padding:10}}>
                    <Subheading style={{fontWeight:"bold", fontFamily: 'Poppins_600SemiBold'}}>{labels.photos}</Subheading>
                    <View>
                    <Button icon="image-plus" color="black" onPress={() => showImageOptions(false)} title={""}/>
                    </View>
                    </View>
                    <View style={{ alignItems: "flex-start", flexDirection:'row', flexWrap:'wrap', paddingHorizontal: 10, minHeight:100}}>
                    {renderImages(urls)}

                </View>
                <Divider/>
                <View style={{justifyContent:'space-around', flexDirection:'row', alignItems:'center'}}>
                <View style={{justifyContent:'center', flexDirection:'row', alignItems:'center', paddingVertical:20}}>
                    <Text>{labels.completeCommand}</Text>
                    <Checkbox color={'black'} onPress={() => showImageOptions(true)} status={completed ? 'checked' : 'unchecked' }/>
                </View>
                <View style={{justifyContent:'center', flexDirection:'row', alignItems:'center', paddingVertical:20}}>
                    <Button style={{width:150}} mode='contained' color={'tomato'} onPress={deleteAlert}>{labels.delete}</Button>
                </View>
                </View>
                </ScrollView>
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