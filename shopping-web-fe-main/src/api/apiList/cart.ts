import api from "..";
import API_PATH from "../apiConfig";

// Company

const list_cart = async (params: any) => {
    return await api.get(API_PATH.CART_LIST ,{params:{...params}})
};

const edit_cart = async (body: any) => {
    return await api.put(API_PATH.CART_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_cart = async(body: any) => {
    return await api.post(API_PATH.CART_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};
export default {
    // product
    list_cart,
    edit_cart,
    create_cart,
}