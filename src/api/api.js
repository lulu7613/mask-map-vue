import axios from 'axios';

const API_URL = 'https://raw.githubusercontent.com';

const appRequest = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

appRequest.interceptors.response.use(
  (resolve) => resolve,
  (error) => Promise.reject(error),
);

export default () => appRequest.get('/kiang/pharmacies/master/json/points.json');
