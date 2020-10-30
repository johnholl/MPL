// Loading.js
import React, {useState, useEffect} from 'react'
import {Button, StyleSheet } from 'react-native'
import {app} from "../config";
import firebase
    from "firebase";

export default function SignOutButton(navigation) {

    const onPress = () => {

    };

    return (
            <Button onPress = {onPress} title = "Sign out"/>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});