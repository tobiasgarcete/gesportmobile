// app/lib/api.ts
import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL,
  withCredentials: true, // <- imprescindible para cookies
});

// === Auth ===
export const signin = async (email: string, password: string) => {
  const body = { email, contrasenia: password };
  const { data } = await api.post("/auth/login", body);
  return data;
};

export const session = async () => {
  const { data } = await api.get("/auth/session");
  return data; // { email, nombre, rol }
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

// === Recursos ===
export const getEvents = async () => {
  const { data } = await api.get("/events/");
  return data as Array<any>;
};
export const createEvent = async (payload: { titulo: string; fecha: string; lugar?: string; descripcion?: string; }) => {
  const { data } = await api.post("/events/", payload);
  return data;
};

export const enrollEvent = async (eventId: string) => {
  const { data } = await api.post(`/events/${eventId}/enroll`);
  return data;
};

export const getMyEvents = async () => {
  const { data } = await api.get("/events/me/inscritos");
  return data;
};