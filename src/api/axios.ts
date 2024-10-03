import axios from "axios";

const baseURL = import.meta.env.VITE_APP_URL_API;

axios.defaults.baseURL = baseURL;

export default axios;
