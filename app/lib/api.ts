import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.10:4000", // cambia a tu IP
});

export const signin = async (email: string, password: string) => {
  const { data } = await api.post("/auth/signin", { email, password });
  api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
  return data;
};

export const me = async () => (await api.get("/users/me")).data;

