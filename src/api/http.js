import axios from './service.js';
export function get(url, params) {
  return axios.get(url, { params });
}
export function post(url, params) {
  return axios.post(url, params);
}