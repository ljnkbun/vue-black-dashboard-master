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
  get() {
    return api.get(`${resource}`, configBearer);
  },
  getEmployee(employeeId) {
    return api.get(`${resource}/${employeeId}`, configBearer);
  },
  saveEmployee(payload) {
    return api.post(`${resource}`, payload, configBearer);
  },
  updateEmployee(employeeId, payload) {
    return api.get(`${resource}/${employeeId}`, payload, configBearer);
  },
  delEmployee(employeeId) {
    return api.get(`${resource}/${employeeId}`, configBearer);
  }
}