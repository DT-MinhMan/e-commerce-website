import api from "..";
import API_PATH from "../apiConfig";

// Company

const list_payment_method = async (params: any) => {
    return await api.get(API_PATH.PAYMENT_METHOD_LIST ,{params:{...params}})
};

const edit_payment_method = async (body: any) => {
    return await api.put(API_PATH.PAYMENT_METHOD_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_payment_method = async(body: any) => {
    return await api.post(API_PATH.PAYMENT_METHOD_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};

const list_user_payment = async (params: any) => {
    return await api.get(API_PATH.USER_PAYMENT_LIST ,{params:{...params}})
};

const edit_user_payment = async (body: any) => {
    return await api.put(API_PATH.USER_PAYMENT_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_user_payment = async(body: any) => {
    return await api.post(API_PATH.USER_PAYMENT_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};
export default {
    list_payment_method,
    edit_payment_method,
    create_payment_method,
    list_user_payment,
    edit_user_payment,
    create_user_payment
}