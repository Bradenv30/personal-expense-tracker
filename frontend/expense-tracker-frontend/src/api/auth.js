import axios from "./axios";

export function userRegister(data) {
  return axios.post("/register", data).then((res) => res.data);
}

export function userLogin(data) {
  return axios.post("/login", data).then((res) => res.data);
}
