import React, {Component, createContext, useContext} from "react";
import {auth} from "../config.tsx"
import {db} from "../config";
import {ConstantContext} from "./ConstantProvider";



export const UserContext = createContext({user: null, totals: null, monthTotals: null, sales: null, level: null, target: null, monthTargets: null});
class UserProvider extends Component {

    static contextType = ConstantContext;
    state = {user: null, totals: null, monthTotals: null, sales: null, level: null, target: null, monthTargets: null};


    componentDidMount() {
        const {constants, posQuestions, fuQuestions} = this.context;
        auth.onAuthStateChanged(userAuth => {
            this.setState({user: userAuth});
            if (userAuth) {
                let monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                monthAgo.setHours(0, 0, 0);
                monthAgo.setMilliseconds(0);
                db.ref("/sales/" + userAuth.uid).orderByChild("timestamp").limitToFirst(100).on("value", (snapshot) => {
                    let items = [];
                    let monthitems = [];
                    let tots = {"10W panel": 0, "estufa": 0, "filter": 0, "prefilter": 0, "total": 0};
                    let monthTots = {"10W panel": 0, "estufa": 0, "filter": 0, "prefilter": 0, "total": 0};
                    snapshot.forEach((child) => {
                        items.push({...child.val(), key: child.key, uid: userAuth.uid});
                        Object.entries(child.val().amounts).map(amt => {
                            tots[amt[0]] += amt[1];
                            tots['total'] += amt[1]
                        });
                        if (child.val().timestamp > monthAgo) {
                            Object.entries(child.val().amounts).map(amt => {
                                monthTots[amt[0]] += amt[1];
                                monthTots['total'] += amt[1]
                            })
                        }
                    });

                    this.setState({sales: items.reverse(), totals: tots, monthTotals: monthTots})

                });
            }
        });
    }

        componentDidUpdate() {
            const {constants, posQuestions, fuQuestions} = this.context;
            if(this.state.level===null && this.state.totals!==null) {
                if (constants) {
                    if (this.state.totals['total'] < constants['comlevel2']) {
                        this.setState({level: 1, target: constants['comlevel2']});
                    } else if (this.state.totals['total'] < constants['comlevel3']) {
                        this.setState({level: 2, target: constants['comlevel3']});

                    } else if (this.state.totals['total'] < constants['comlevel4']) {
                        this.setState({level: 3, target: constants['comlevel4']});

                    } else if (this.state.totals['total'] < constants['comlevel5']) {
                        this.setState({level: 4, target: constants['comlevel5']});
                    } else {
                        this.setState({level: 5, target: 5000});

                    }
                    this.setState({monthTargets:
                            {"10W panel": constants['10wmonth'], "estufa": constants['stovemonth'],
                                "filter": constants['filtermonth'], "prefilter": constants['prefiltermonth']}})
                }
            }
    }

    render() {return(
        <UserContext.Provider value={this.state}>
            {this.props.children}
        </UserContext.Provider>
    )
    }
}

export default UserProvider