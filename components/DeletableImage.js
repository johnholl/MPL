import React from 'react';
import {ImageBackground, View, Alert, Text} from 'react-native';
import {Button} from 'react-native-paper'
import {db} from "../config";

export default function DeletableImage(props) {
    let url = props.url;
    console.log("URL");
    console.log(url);
    console.log(props.payment);
    let imgRef;
    if(!props.payment) {
        imgRef = props.itemRef.child('/imgURLs/' + url[0]);
    }
    else {
        imgRef = props.itemRef.child('/paymentUrl/' + url[0]);
    }


    function imgDelete() {

        imgRef.remove();
    };

    const showAlert = () => {
        Alert.alert(
            "Are you sure",
            "Remove image",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: imgDelete}
            ],
            { cancelable: true }
        );
    };

    return(
        <ImageBackground source={{uri: url[1]}}
                         style={{resizeMode: 'contain', width:100, height:100, flexDirection:"row"}}>
                <Button icon={"close-box"} onPress={showAlert} color="gray"/>
        </ImageBackground>
    )
}