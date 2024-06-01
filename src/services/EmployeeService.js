import api from './APICommon.js';

const resource = "/Employee";

export default {
  data() {
    return {
      token: String,
      configBearer: {}
    }
  },
  resetToken() {
    this.token = localStorage.getItem('token')
    this.configBearer = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Authorization": `Bearer ${this.token}`,
      }
    };
  },
  get(params) {
    this.resetToken()
    if (params)
      return api.get(`${resource}?${params}`, this.configBearer);
    else
      return api.get(`${resource}`, this.configBearer);
  },
  getEmployee(employeeId) {
    this.resetToken()
    return api.get(`${resource}/${employeeId}`, this.configBearer);
  },
  saveEmployee(payload) {
    this.resetToken()
    return api.post(`${resource}`, payload, this.configBearer);
  },
  updateEmployee(employeeId, payload) {
    this.resetToken()
    return api.put(`${resource}/${employeeId}`, payload, this.configBearer);
  },
  delEmployee(employeeId) {
    this.resetToken()
    return api.delete(`${resource}/${employeeId}`, this.configBearer);
  }
}