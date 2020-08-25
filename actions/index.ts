import {db} from "../config";
export const SET_SMALL_AMOUNT = "SET_SMALL_AMOUNT";
export const SET_LARGE_AMOUNT = "SET_LARGE_AMOUNT";
export const SET_DATE = "SET_DATE";

export const setSmallAmount = (data: any) => async (dispatch: any) => {
    dispatch({ type: SET_SMALL_AMOUNT, payload: data });
};

export const setLargeAmount = (data: any) => async (dispatch: any) => {
    dispatch({ type: SET_LARGE_AMOUNT, payload: data });
};

export const setDate = (data: any) => async (dispatch: any) => {
    dispatch({ type: SET_DATE, payload: data });
};

export const submitAmounts = (small: any, large: any) => async (dispatch: any) => {
    db.ref('/items').push({
        small: small,
        large: large,
    });
};
