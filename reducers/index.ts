import { combineReducers } from "redux";
import selectedSmallAmountReducer from "./smallAmount";
import selectedLargeAmountReducer from "./largeAmount";

export default combineReducers({
    selectedSmallAmount: selectedSmallAmountReducer,
    selectedLargeAmount: selectedLargeAmountReducer,

});