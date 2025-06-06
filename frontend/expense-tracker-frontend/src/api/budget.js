import axios from "./axios";

export function getAllBudgets() {
  return axios.get("/budget");
}

export function getBudgetById(id) {
  return axios.get(`/budget/${id}`);
}

export function createBudget(data) {
  return axios.post("/budget", data);
}

export function updateBudget(id, data) {
  return axios.patch(`/budget/${id}`, data);
}

export function deleteBudget(id) {
  return axios.delete(`/budget/${id}`);
}
