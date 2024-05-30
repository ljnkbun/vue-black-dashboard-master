import api from './APICommon.js';

const resource = "/Auth";
const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  }
};

export default {
  auth(payload) {
    return api.post(`${resource}/login`, payload, config);
  },
  logout(payload) {
    var token = localStorage.getItem('token')
    var configBearer = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Authorization": `Bearer ${token}`,
      }
    };
    return api.post(`${resource}/logout/${payload}`, null, configBearer);
  }
}