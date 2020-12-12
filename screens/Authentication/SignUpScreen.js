// SignUp.js
import React, {useContext, useState} from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import {app} from '../../config'
import firebase from "firebase";
import {LanguageContext} from "../../providers/LanguageProvider";


export default function SignUpScreen(props) {
    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [errorMessage, setErrorMessage] = useState(null);

    let {language, labels} = useContext(LanguageContext);

    const handleSignUp = () => {
        firebase.auth(app).createUserWithEmailAndPassword(email, password)
            .then(() => {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: name
                }).then(function() {
                    // Update successful.
                }, function(error) {
                    // An error happened.
                });

                props.navigation.reset({
                index: 0,
                routes: [{ name: 'Authtabs' }],
            });})
            .catch(error => {setErrorMessage(error.message)})
    };

        return (
            <View style={styles.container}>
                <Text>{labels.signupTitle}</Text>
                {errorMessage &&
                <Text style={{ color: 'red' }}>
                    {errorMessage}
                </Text>}
                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder={labels.nameInput}
                    onChangeText={name => setName(name)}
                    value={name}
                />
                <TextInput
                    placeholder={labels.emailInput}
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={em => setEmail(em)}
                    value={email}
                />
                <TextInput
                    secureTextEntry
                    placeholder={labels.passwordInput}
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={pwd => setPassword(pwd)}
                    value={password}
                />
                <View style={{paddingVertical:40}}>
                <Button title={labels.signupButton} onPress={handleSignUp}/>
                </View>
                <View>
                    <Text>{labels.loginPrompt}</Text>
                <Button
                    title={labels.loginButton}
                    onPress={() => props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
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