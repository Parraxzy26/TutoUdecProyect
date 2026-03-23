<template>
  <div class="auth-page">
    <div class="card">
      <h1>Iniciar sesión</h1>
      <p class="lead">Accede con tu usuario de TutoUdec</p>

      <form @submit.prevent="submit">
        <label for="username">Usuario</label>
        <input
          id="username"
          v-model="username"
          type="text"
          autocomplete="username"
          required
        />

        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <p class="footer-link">
        ¿No tienes cuenta?
        <RouterLink to="/formulario">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    const redirect = route.query.redirect || '/';
    router.push(redirect);
  } catch (e) {
    const d = e.response?.data;
    error.value =
      d?.detail ||
      (typeof d === 'object' ? Object.values(d).flat().join(' ') : null) ||
      'No se pudo iniciar sesión';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.lead {
  color: #666;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #34a853;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #c62828;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.footer-link {
  margin-top: 1.25rem;
  text-align: center;
}

.footer-link a {
  color: #34a853;
  font-weight: 600;
}
</style>
