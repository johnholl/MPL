// Loading.js
import React, {useState, useEffect} from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import {app} from "../../config";
import firebase
    from "firebase";
import {StackActions} from "react-navigation";
export default function Loading(props) {


    useEffect(() => {
        firebase.auth(app).onAuthStateChanged(user => {
            if (user) {
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Authtabs' }],
                });
            } else {
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        })});

        return (
            <View style={styles.container}>
                <Text>Loading</Text>
                <ActivityIndicator size="large" />
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});