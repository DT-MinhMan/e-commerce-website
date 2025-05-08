import api from "..";
import API_PATH from "../apiConfig";

// Company
const info_product = async (params: any) => {
    return await api.get(API_PATH.PRODUCT_INFO ,{params:{...params}})
};

const list_product = async (params: any) => {
    return await api.get(API_PATH.PRODUCT_LIST ,{params:{...params}})
};

const edit_product = async (body: any) => {
    return await api.put(API_PATH.PRODUCT_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const add_product_details = async(body: any) => {
    return await api.post(API_PATH.PRODUCT_ADD_DETAILS ,body, {headers: {"Content-Type": "application/json"}})
};

const edit_product_details = async(body: any) => {
    return await api.put(API_PATH.PRODUCT_EDIT_DETAILS ,body, {headers: {"Content-Type": "application/json"}})
};

const create_product = async(body: any) => {
    return await api.post(API_PATH.PRODUCT_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};
// product types
const list_product_types = async (params: any) => {
    return await api.get(API_PATH.PRODUCT_TYPES_LIST ,{params:{...params}})
};

const edit_product_types = async (body: any) => {
    return await api.put(API_PATH.PRODUCT_TYPES_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_product_types = async(body: any) => {
    return await api.post(API_PATH.PRODUCT_TYPES_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};
// product materials
const list_product_materials = async (params: any) => {
    return await api.get(API_PATH.PRODUCT_MATERIALS_LIST ,{params:{...params}})
};

const edit_product_materials = async (body: any) => {
    return await api.put(API_PATH.PRODUCT_MATERIALS_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_product_materials = async(body: any) => {
    return await api.post(API_PATH.PRODUCT_MATERIALS_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};
// product sizes
const list_product_sizes = async (params: any) => {
    return await api.get(API_PATH.PRODUCT_SIZES_LIST ,{params:{...params}})
};

const edit_product_sizes = async (body: any) => {
    return await api.put(API_PATH.PRODUCT_SIZES_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_product_sizes = async(body: any) => {
    return await api.post(API_PATH.PRODUCT_SIZES_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};
// product colors
const list_product_colors = async (params: any) => {
    return await api.get(API_PATH.PRODUCT_COLORS_LIST ,{params:{...params}})
};

const edit_product_colors = async (body: any) => {
    return await api.put(API_PATH.PRODUCT_COLORS_EDIT ,body, {headers: {"Content-Type": "application/json"}})
};

const create_product_colors = async(body: any) => {
    return await api.post(API_PATH.PRODUCT_COLORS_CREATE ,body, {headers: {"Content-Type": "application/json"}})
};


export default {
    // product
    list_product,
    edit_product,
    create_product,
    info_product,
    add_product_details,
    edit_product_details,
    // types
    list_product_types,
    edit_product_types,
    create_product_types,
    // materials
    list_product_materials,
    edit_product_materials,
    create_product_materials,
    // sizes
    list_product_sizes,
    edit_product_sizes,
    create_product_sizes,
    // colors
    list_product_colors,
    edit_product_colors,
    create_product_colors
}