import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi, setTokens, clearTokens, api } from '@/services/api';

const USER_KEY = 'tutoudec_user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) user.value = JSON.parse(raw);
    } catch {
      user.value = null;
    }
  }

  function persistUser(u) {
    user.value = u;
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  }

  loadFromStorage();

  const isAuthenticated = computed(() => !!user.value);

  async function login(username, password) {
    const { data } = await authApi.login({ username, password });
    setTokens(data.access, data.refresh);
    persistUser(data.user);
    return data;
  }

  async function register(payload) {
    const { data } = await authApi.register(payload);
    setTokens(data.access, data.refresh);
    persistUser(data.user);
    return data;
  }

  async function fetchProfile() {
    const { data } = await authApi.profile();
    persistUser(data);
    return data;
  }

  function logout() {
    clearTokens();
    persistUser(null);
    delete api.defaults.headers.common.Authorization;
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    logout,
    loadFromStorage,
  };
});
