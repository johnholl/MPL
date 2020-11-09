import React from 'react';
import {ImageBackground, View, Alert, Text} from 'react-native';
import {Button} from 'react-native-paper'
import {db} from "../config";

export default function DeletableImage(props) {
    let url = props.url;
    const imgRef = props.itemRef.child('/imgURLs/' +url[0]);
    console.log(imgRef);

    const imgDelete = () => {
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
        <View style={{padding: 10}}>
        <ImageBackground source={{uri: url[1]}}
                         style={{
                             width: null,
                             height: null,
                             resizeMode: 'contain'}}>
                <Button icon={"close-box"} onPress={showAlert} color="gray"/>
        </ImageBackground>
        </View>
    )
}