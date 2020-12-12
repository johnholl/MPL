// Login.js
import React, {useContext, useState} from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import {app} from '../../config'
import firebase from "firebase";
import {LanguageContext} from "../../providers/LanguageProvider";


export default function LoginScreen(props) {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [errorMessage, setErrorMessage] = useState(null);

    let {language, labels} = useContext(LanguageContext);



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
                <Text>{labels.loginTitle}</Text>
                {errorMessage &&
                <Text style={{ color: 'red' }}>
                    {errorMessage}
                </Text>}
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder={labels.emailInput}
                    onChangeText={email => setEmail(email)}
                    value={email}
                />
                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder={labels.passwordInput}
                    onChangeText={password => setPassword(password)}
                    value={password}
                />
                <View style={{paddingVertical:20}}>
                <Button title={labels.loginButton} onPress={handleLogin} />
                </View>
                <View>
                    <Text> {labels.signupPrompt} </Text>
                <Button
                    title={labels.signupButton}
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