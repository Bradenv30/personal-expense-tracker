import axios from "./axios";

export function getAllExpenses() {
  return axios.get("/expenses").then((res) => res.data);
}

export function getExpenseById(id) {
  return axios.get(`/expenses/${id}`).then((res) => res.data);
}

export function createExpense(data) {
  return axios.post("/expenses", data).then((res) => res.data);
}

export function updateExpense(id, data) {
  return axios.patch(`/expenses/${id}`, data).then((res) => res.data);
}

export function deleteExpense(id) {
  return axios.delete(`/expenses/${id}`).then((res) => res.data);
}
