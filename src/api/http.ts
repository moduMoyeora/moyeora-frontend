import axios from 'axios';

const BASE_URL = "http://localhost:3000";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type':'application/json'
  },
  withCredentials: true // CORS 관련 설정이 필요한 경우
})

