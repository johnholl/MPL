import { SET_SMALL_AMOUNT } from "../actions";

export default (state = "", action: any) => {
    switch (action.type) {
        case SET_SMALL_AMOUNT:
            return action.payload;
        default:
            return state;
    }
};
