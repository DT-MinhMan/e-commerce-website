import api from "..";
import API_PATH from "../apiConfig";

// Company

const list_user = async (params: any) => {
    return await api.get(API_PATH.USER_LIST ,{params:{...params}})
};

const user_info = async (params: any) => {
    return await api.get(API_PATH.USER_INFO ,{params:{...params}})
};

const edit_user = async (body: any) => {
    return await api.put(API_PATH.USER_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_user = async(body: any) => {
    return await api.post(API_PATH.USER_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};

const info_user = async (params: any) => {
    return await api.get(API_PATH.USER_INFO ,{params:{...params}})
};

export default {
    list_user,
    user_info,
    edit_user,
    create_user,
    info_user
}