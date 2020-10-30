import React from 'react';
import {Text, Button, View, StyleSheet, TextInput, Platform, StatusBar} from 'react-native';
import {Card} from 'react-native-paper';
import {KeyboardAwareFlatList, KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Picker} from '@react-native-community/picker';
import MultiSelect from 'react-native-multiple-select';
import {app, db} from "../config";
import firebase from "firebase";


export default function Survey(props) {
    const { currentUser } = firebase.auth(app);
    const [answers, setAnswer] = React.useState({});
    let count = 0;

    let questions = props.route.params.questions ? props.route.params.questions : props.questions;


    const onFinishPress = () => {

        if (props.route.params.newSale) {
            let params = props.route.params;
            params = {
                ...params, answers,
                user: currentUser.email, completed: false
            };
            db.ref('/sales/'+currentUser.uid).push(params);
            props.navigation.navigate('Home');
        }
        else {
            let saleID = props.route.params._id;
            db.ref('/sales/' +currentUser.uid + '/' + saleID).push(answers)


        }
    };

    const styles = StyleSheet.create({
        container: {display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    minHeight: '100vh', width:'100%'},
        form: {width: '100%', paddingHorizontal: 10, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}

    });

    return (
        <KeyboardAwareScrollView>
            <View style={styles.form}>
                <View style={{padding:20}}>
                    <Text>{"Client Questions"}</Text>
                </View>
                {questions.map((question) => {
            if(question.type==="t") {
                count ++;
                return (
                    <View style={{padding: 10}}>
                        <Card>
                            <Card.Content>
                                <Text>{count + ". " + question.question}</Text>
                                <TextInput
                                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                placeholder={question.question}
                                onChangeText={text => {
                                    setAnswer({...answers, [question.question]: text})
                                }}
                                value={answers[question.question]}/>
                            </Card.Content>
                        </Card>
                    </View>)
            }

            else if(question.type==="n") {
                count ++;
                return (
                    <View style={{padding: 10}}>
                        <Card>
                            <Card.Content>
                                <Text>{count + ". " + question.question}</Text>
                                <TextInput
                                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                placeholder={question.question}
                                onChangeText={text => {
                                    setAnswer({...answers, [question.question]: text})
                                }}
                                value={answers[question.question]}/>
                            </Card.Content>
                        </Card>
                    </View>)
            }

            else if(question.type==="mc") {
                count++;
                return (
                    <View style={{padding: 10}}>
                        <Card>
                            <Card.Content>
                                <Text>{count + ". " + question.question}</Text>
                                <Picker prompt={question.question} style={{ height: 40 }}
                                        onValueChange={(itemValue, itemIndex) => {setAnswer({...answers, [question.question]: itemValue})}}
                                        selectedValue={answers[question.question]}
                                >
                                    {question.options.map((option) => {
                                        return(<Picker.Item label={option} value={option} />)
                                    })}
                                </Picker>
                            </Card.Content>
                        </Card>
                    </View>
                )
            }

            // else if(question.type==="ms") {
            //     return (
            //     <View>
            //         <Text>{question.question}</Text>
            //         <MultiSelect style={{ height: 40 }} onSelectedItemsChange={(selectedItems) => {setAnswer({...answers, question: selectedItems})}}>
            //             <Picker.Item label="Java" value="java" />
            //             <Picker.Item label="JavaScript" value="js" />
            //         </MultiSelect>
            //     </View>)
            // }

            })}
            </View>
            <View style={{padding:20}}>
                <Button
                    title="Finish Up"
                    color={'green'}
                    onPress={() =>
                        onFinishPress()
                    }/>
            </View>
        </KeyboardAwareScrollView>
    );
}