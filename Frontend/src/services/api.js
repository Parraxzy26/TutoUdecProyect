import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000/api';

const ACCESS_KEY = 'tutoudec_access';
const REFRESH_KEY = 'tutoudec_refresh';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem(REFRESH_KEY);
      if (refresh) {
        try {
          const { data } = await axios.post(`${baseURL}/auth/refresh/`, {
            refresh,
          });
          localStorage.setItem(ACCESS_KEY, data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem(ACCESS_KEY);
          localStorage.removeItem(REFRESH_KEY);
        }
      }
    }
    return Promise.reject(error);
  }
);

export function setTokens(access, refresh) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export const authApi = {
  login: (body) => api.post('/auth/login/', body),
  register: (body) => api.post('/auth/register/', body),
  profile: () => api.get('/auth/profile/'),
  refresh: (refresh) => api.post('/auth/refresh/', { refresh }),
};

export const tutoresApi = {
  list: (params) => api.get('/tutores/', { params }),
  get: (id) => api.get(`/tutores/${id}/`),
  estadisticas: (id) => api.get(`/tutores/${id}/estadisticas/`),
  tutorias: (id, params) =>
    api.get(`/tutores/${id}/tutorias/`, { params }),
};

export const materiasApi = {
  list: (params) => api.get('/materias/', { params }),
  get: (id) => api.get(`/materias/${id}/`),
  tutores: (id) => api.get(`/materias/${id}/tutores/`),
};

export const tutoriasApi = {
  list: (params) => api.get('/tutorias/', { params }),
  get: (id) => api.get(`/tutorias/${id}/`),
  misTutorias: (params) =>
    api.get('/tutorias/mis_tutorias/', { params }),
  create: (body) => api.post('/tutorias/', body),
  confirmar: (id) => api.post(`/tutorias/${id}/confirmar/`),
  cancelar: (id) => api.post(`/tutorias/${id}/cancelar/`),
};

export { ACCESS_KEY, REFRESH_KEY };
