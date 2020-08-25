import React from 'react';
import {TextInput, Text, Button, View} from 'react-native';
import {db} from "../config";


let InterviewScreen;
export default InterviewScreen = ({ route, navigation }) => {
    const [value1, onChangeText1] = React.useState('');
    const [value2, onChangeText2] = React.useState('');

    const question1 = "How old are you?";
    const question2 = "How many litres of diesel do you use each week?";

    const onFinishPress = () => {
        let params = route.params;
        params = {...params, questions: {1: {question: question1, answer: value1},
                                         2: {question: question2, answer: value2}},
                            name: "John", completed: false};
        console.log("All params");
        console.log(params);
        db.ref('/sales').push(params);
        navigation.navigate('Home');
    };

    return (
        <View>
            <Text>This is where interview questions go</Text>
            <Text>{question1}</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => onChangeText1(text)}
                value={value1}/>
            <Text>{question2}</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
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