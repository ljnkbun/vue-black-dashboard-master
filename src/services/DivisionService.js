import api from './APICommon.js';
import { store } from '../store.js';

const resource = "/Division";

export default {
  data() {
    return {
      token: String,
      configBearer: {}
    }
  },
  resetToken() {
    this.token = store.getters.getToken;
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
  getDivision(divionId) {
    this.resetToken()
    return api.get(`${resource}/${divionId}`, this.configBearer);
  },
  saveDivision(payload) {
    this.resetToken()
    return api.post(`${resource}`, payload, this.configBearer);
  },
  updateDivision(divionId, payload) {
    this.resetToken()
    return api.put(`${resource}/${divionId}`, payload, this.configBearer);
  },
  delDivision(divionId) {
    this.resetToken()
    return api.delete(`${resource}/${divionId}`, this.configBearer);
  }
}