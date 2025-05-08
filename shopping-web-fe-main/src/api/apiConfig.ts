export const API_PATH = {
    LOGIN: getAuthenticationPath("auth/local"),
    SIGNUP: getFullPath("auth/local/register"),
    CHANGE_PASSWORD: getFullPath("auth/change-password"), 
    PROFILE: getAuthenticationPath("users/me"),
    
    //NEW API ROUTES
    // user list
    USER_LIST: getFullPath("user/list-user"),
    USER_INFO: getFullPath("user/user-info"),
    USER_EDIT: getFullPath("user/update"),
    USER_CREATE: getFullPath("user/register"),

    // product
    PRODUCT_LIST: getFullPath("product/get-list"),
    PRODUCT_EDIT: getFullPath("product/edit-product"),
    PRODUCT_CREATE: getFullPath("product/add-product"),
    PRODUCT_INFO: getFullPath("product/product-info"),
    PRODUCT_ADD_DETAILS: getFullPath("product/add-product-details"),
    PRODUCT_EDIT_DETAILS: getFullPath("product/edit-product-details"),
    // cart
    CART_LIST: getFullPath("cart/get-list-cart"),
    CART_EDIT: getFullPath("cart/edit-cart"),
    CART_CREATE: getFullPath("cart/add-to-cart"),

    // types
    PRODUCT_TYPES_LIST: getFullPath("product/get-list-type"),
    PRODUCT_TYPES_EDIT: getFullPath("product/edit-type"),
    PRODUCT_TYPES_CREATE: getFullPath("product/add-type"),

    // materials
    PRODUCT_MATERIALS_LIST: getFullPath("product/get-list-material"),
    PRODUCT_MATERIALS_EDIT: getFullPath("product/edit-material"),
    PRODUCT_MATERIALS_CREATE: getFullPath("product/add-material"),

    // size
    PRODUCT_SIZES_LIST: getFullPath("product/get-list-size"),
    PRODUCT_SIZES_EDIT: getFullPath("product/edit-size"),
    PRODUCT_SIZES_CREATE: getFullPath("product/add-size"),

    // color
    PRODUCT_COLORS_LIST: getFullPath("product/get-list-color"),
    PRODUCT_COLORS_EDIT: getFullPath("product/edit-color"),
    PRODUCT_COLORS_CREATE: getFullPath("product/add-color"),

    //payment
    PAYMENT_LIST: getFullPath("payment/get-list-payment"),
    PAYMENT_CREATE: getFullPath("payment/add-payment"),
    PAYMENT_EDIT: getFullPath("payment/edit-payment"),
    // payment method
    PAYMENT_METHOD_LIST: getFullPath("payment/get-list-payment"),
    PAYMENT_METHOD_EDIT: getFullPath("payment/edit-payment"),
    PAYMENT_METHOD_CREATE: getFullPath("payment/add-payment"),

    // user payment
    USER_PAYMENT_LIST: getFullPath("payment/get-list-user-payment"),
    USER_PAYMENT_EDIT: getFullPath("payment/edit-user-payment"),
    USER_PAYMENT_CREATE: getFullPath("payment/add-user-payment"),

    // order
    ORDER_LIST: getFullPath("order/order-get-list"),
    ORDER_INFO: getFullPath("order/order-info"),
    ORDER_EDIT_STATUS: getFullPath("order/order-edit-status"),
    ORDER_CREATE: getFullPath("order/order-add")
}

function getAuthenticationPath(path: String){
    return getFullPath(`${path}`)
}

function getFullPath(path:String){
    return `${process.env.NEXT_APP_BASE_URL}/api/${path}`
};

function getV1Path(path: String){
    return `${process.env.NEXT_APP_BASE_URL}/api/v1/${path}`
}


export default API_PATH;