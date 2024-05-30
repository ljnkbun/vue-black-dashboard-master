import api from './APICommon.js';

const resource = "/Employee";
const token = localStorage.getItem('token')
const configBearer = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Authorization": `Bearer ${token}`,
  }
};

export default {
  auth(payload) {
    return api.post(`${resource}/login`, payload, config);
  },
  logout(payload) {

    return api.post(`${resource}/logout/${payload}`, null, configBearer);
  }
}