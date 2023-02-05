import axios from 'axios';

const BASE_URL = 'https://my.api.mockaroo.com';
const KEY = '3045b9b0';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});
export {KEY};
export default API;
