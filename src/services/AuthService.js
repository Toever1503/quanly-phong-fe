import { Axios } from "./Axios";

const baseUrl = `/users/`;

function signin(payload) {
  return Axios.post(`${baseUrl}login`, payload);
}

function signUp(payload) {
  return Axios.post(`${baseUrl}signup`, payload);
}

export const AuthService = {
  signin,
  signUp
};