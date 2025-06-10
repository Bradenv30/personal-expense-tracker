import axios from "./axios";

export function getAllBudgets() {
  return axios.get("/budget").then((res) => res.data);
}

export function getBudgetById(id) {
  return axios.get(`/budget/${id}`).then((res) => res.data);
}

export function createBudget(data) {
  return axios.post("/budget", data).then((res) => res.data);
}

export function updateBudget(id, data) {
  return axios.patch(`/budget/${id}`, data).then((res) => res.data);
}

export function deleteBudget(id) {
  return axios.delete(`/budget/${id}`).then((res) => res.data);
}
