import axios from "./axios";

export function getAllExpenses() {
  return axios.get("/expenses");
}

export function getExpenseById(id) {
  return axios.get(`/expenses/${id}`);
}

export function createExpense(data) {
  return axios.post("/expenses", data);
}

export function updateExpense(id, data) {
  return axios.patch(`/expenses/${id}`, data);
}

export function deleteExpense(id) {
  return axios.delete(`/expenses/${id}`);
}
