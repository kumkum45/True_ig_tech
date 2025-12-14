import api, { saveToken, getToken } from "../api/client";

export async function login(role, { email, password }) {
  const endpoint = `/api/login/${role}`;
  const res = await api.post(endpoint, { email, password });
  if (res?.data?.token) {
    saveToken(res.data.token);
  }
  return res.data;
}

export function logout() {
  localStorage.removeItem("jwt");
}

export function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

export function getCurrentUser() {
  const token = getToken();
  return parseJwt(token);
}
