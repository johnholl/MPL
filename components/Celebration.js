import React, {useState, useContext} from 'react';
import {Portal} from "react-native-paper";
import {Text, View} from "react-native";
import Fireworks from "react-native-fireworks";
import { Audio } from 'expo-av';


export default function Celebration({visible=false}) {
    const [sound, setSound] = React.useState();

    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/clapping.mp3')
        );

        console.log('Playing Sound');
        await sound.playAsync(); }

    if(visible){
        playSound();
    }

    return(
        <Portal>
            {visible &&
            <View justify={"center"} alignItems={"center"}>
                <Text>CONGRATULATIONS</Text>
            </View>
            }{visible &&
        <Fireworks
            speed={2}
            density={8}
            zIndex={2}
        />}
        </Portal>
    )
}

