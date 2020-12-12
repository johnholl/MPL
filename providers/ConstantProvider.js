import React, {Component, createContext} from "react";
import {db} from "../config.tsx"


export const ConstantContext = createContext({constants: null, posQuestions: null, fuQuestions: null});

class ConstantProvider extends Component {
    state = {constants: null, posQuestions: null, fuQuestions: null};

    componentDidMount = () => {
        let constRef = db.ref("/constants");

        constRef.on("value", (snapshot) => {
            let cons = {};
            snapshot.forEach((child) => {
                cons[child.key] = child.val().constVal;
            });
            this.setState({constants: cons})});

        let posQuestionRef = db.ref("/questions/pos");
        let fuQuestionRef = db.ref("/questions/fu");
        posQuestionRef.on("value", (snapshot) => {
            // get children as an array
            let posqs = [];
            snapshot.forEach((child) => {
                posqs.push(child.val());
            });
            this.setState({posQuestions: posqs})
        });

        fuQuestionRef.on("value", (snapshot) => {
            // get children as an array
            let fuqs = [];
            snapshot.forEach((child) => {
                fuqs.push(child.val());
            });
            this.setState({fuQuestions: fuqs})
        });
    };

    render() {return(
        <ConstantContext.Provider value={this.state}>
            {this.props.children}
        </ConstantContext.Provider>
    )
    }
}

export default ConstantProvider