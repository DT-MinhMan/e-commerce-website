import api from ".";
import { API_PATH } from "./apiConfig";

//login
const login = async (props: { identifier: string; password: string }) => {
  return await api.post(API_PATH.LOGIN, props);
};

const sign_up = async (props: {
  username: string;
  email: string;
  password: string;
}) => {
  return await api.post(API_PATH.SIGNUP, props);
};

const get_user = async () => {
  return await api.get(API_PATH.PROFILE);
};


  export default {
    login,
    sign_up,
    get_user,
  };
