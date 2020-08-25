import {SET_LARGE_AMOUNT} from "../actions";

export default (state = {}, action: any) => {
    switch (action.type) {
        case SET_LARGE_AMOUNT:
            return action.payload;
        default:
            return state;
    }
};
