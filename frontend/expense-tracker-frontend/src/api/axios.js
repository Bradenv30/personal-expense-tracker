import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001", // 5000 is used by Airplay and airtunes on mac
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
