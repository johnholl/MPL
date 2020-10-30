import React from 'react';
import {Text, Button, View, StyleSheet, TextInput} from 'react-native';
import {app, db} from "../../config";
import firebase from "firebase";


let InterviewScreen;
export default InterviewScreen = (props) => {
    const [value1, onChangeText1] = React.useState('');
    const [value2, onChangeText2] = React.useState('');

    const question1 = "Age";
    const question2 = "Diesel used each week in litres";
    const { currentUser } = firebase.auth(app);

    const onFinishPress = () => {
        let params = props.route.params;
        params = {...params, questions: {1: {question: question1, answer: value1},
                                         2: {question: question2, answer: value2}},
                            user: currentUser.email, completed: false};
        db.ref('/sales/').push(params);
        navigation.navigate('Home');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

        textInput: {
            height: 40,
            width: '90%',
            borderColor: 'gray',
            borderWidth: 1,
            marginTop: 8
        }
    });

    return (
        <View style={styles.container}>
            <Text>Questions for the buyer</Text>
            <TextInput
                style={styles.textInput}
                placeholder={question1}
                onChangeText={text => onChangeText1(text)}
                value={value1}/>

            <TextInput
                style={styles.textInput}
                placeholder={question2}
                onChangeText={text => onChangeText2(text)}
                value={value2}/>
            <Button
            title="Finish Up"
            onPress={() =>
            onFinishPress()
            }/>
        </View>
    );
};