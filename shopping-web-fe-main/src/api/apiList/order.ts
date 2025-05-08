import api from "..";
import API_PATH from "../apiConfig";

// Company

const list_order = async (params: any) => {
    return await api.get(API_PATH.ORDER_LIST ,{params:{...params}})
};
const order_info = async (params: any) => {
    return await api.get(API_PATH.ORDER_INFO ,{params:{...params}})
};

const edit_order_status = async (body: any) => {
    return await api.put(API_PATH.ORDER_EDIT_STATUS ,body, {headers: {"Content-Type": "application/json"}})
};

const create_order = async(body: any) => {
    return await api.post(API_PATH.ORDER_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};
export default {
    // product
    order_info,
    list_order,
    edit_order_status,
    create_order,
}