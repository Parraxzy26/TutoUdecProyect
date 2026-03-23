import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../config';

const TOKEN_KEY = '@TutoUdec:token';
const REFRESH_KEY = '@TutoUdec:refreshToken';

const API_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refresh = await AsyncStorage.getItem(REFRESH_KEY);
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh,
          });
          await AsyncStorage.setItem(TOKEN_KEY, data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL, TOKEN_KEY, REFRESH_KEY };

export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  getProfile: () => api.get('/auth/profile/'),
};

export const tutorService = {
  getAll: (params) => api.get('/tutores/', { params }),
  getById: (id) => api.get(`/tutores/${id}/`),
  create: (data) => api.post('/tutores/', data),
  update: (id, data) => api.put(`/tutores/${id}/`, data),
  delete: (id) => api.delete(`/tutores/${id}/`),
  getEstadisticas: (id) => api.get(`/tutores/${id}/estadisticas/`),
  getTutorias: (id, params) =>
    api.get(`/tutores/${id}/tutorias/`, { params }),
};

export const materiaService = {
  getAll: (params) => api.get('/materias/', { params }),
  getById: (id) => api.get(`/materias/${id}/`),
  create: (data) => api.post('/materias/', data),
  update: (id, data) => api.put(`/materias/${id}/`, data),
  delete: (id) => api.delete(`/materias/${id}/`),
  getTutores: (id) => api.get(`/materias/${id}/tutores/`),
};

export const tutoriaService = {
  getAll: (params) => api.get('/tutorias/', { params }),
  getById: (id) => api.get(`/tutorias/${id}/`),
  create: (data) => api.post('/tutorias/', data),
  update: (id, data) => api.put(`/tutorias/${id}/`, data),
  delete: (id) => api.delete(`/tutorias/${id}/`),
  confirmar: (id) => api.post(`/tutorias/${id}/confirmar/`),
  iniciar: (id) => api.post(`/tutorias/${id}/iniciar/`),
  completar: (id, nota) =>
    api.post(`/tutorias/${id}/completar/`, { nota }),
  cancelar: (id) => api.post(`/tutorias/${id}/cancelar/`),
  getMisTutorias: (params) =>
    api.get('/tutorias/mis_tutorias/', { params }),
};
