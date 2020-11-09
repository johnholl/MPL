// Login.js
import React, {useState} from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import {app} from '../../config'
import firebase from "firebase";


export default function LoginScreen(props) {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = () => {
        firebase.auth(app).signInWithEmailAndPassword(email, password)
            .then(() => props.navigation.reset({
                index: 0,
                routes: [{ name: 'Authtabs' }],
            }))
            .catch(error => setErrorMessage(error.message))
    };

        return (
            <View style={styles.container}>
                <Text>Login</Text>
                {errorMessage &&
                <Text style={{ color: 'red' }}>
                    {errorMessage}
                </Text>}
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => setEmail(email)}
                    value={email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => setPassword(password)}
                    value={password}
                />
                <View style={{paddingVertical:20}}>
                <Button title="Login" onPress={handleLogin} />
                </View>
                <View>
                    <Text>No account? </Text>
                <Button
                    title="Sign Up"
                    onPress={() => props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Signup' }],
                    })}
                />
                </View>
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    }
});