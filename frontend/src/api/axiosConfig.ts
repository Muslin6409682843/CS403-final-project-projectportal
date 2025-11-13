import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  withCredentials: true, // ✅ ส่ง cookie ทุก request
});

export default api;
