import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const urlApi = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export { urlApi };
