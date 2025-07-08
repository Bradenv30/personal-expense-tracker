import axios from "./axios";

export function userRegister(data) {
  return axios.post("/register", data).then((res) => res.data);
}

export function userLogin(data) {
  return axios.post("/login", data).then((res) => res.data);
}

export function updateAccount(data) {
  const token = localStorage.getItem("token");
  return axios
    .patch("/account", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}

export function deleteAccount() {
  const token = localStorage.getItem("token");
  return axios
    .delete("/account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
}
