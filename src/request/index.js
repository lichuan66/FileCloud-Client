import axios from "axios";
import { IP, PORT } from "@/config/ipConfig";

// 创建axios实例
const service = axios.create({
  baseURL: `http://114.132.151.234:8877/api`,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截
service.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (localStorage.getItem("token")) {
    config.headers.Authorization = localStorage.getItem("token") || "";
  }
  return config;
});
// 响应拦截
service.interceptors.response.use(
  (res) => {
    const code = res.data.code;
    if (code === "401") {
      window.location.href = "/login";
      return;
    }
    if (code < 200 || code >= 300) {
      return Promise.reject(res.data.msg);
    }
    return res.data;
  },
  (err) => {
    console.log(err);
  }
);

export default service;
