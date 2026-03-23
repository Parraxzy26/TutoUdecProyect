<template>
  <div class="auth-page">
    <div class="card">
      <h1>Crear cuenta</h1>
      <p class="lead">Únete a la plataforma de tutorías</p>

      <form @submit.prevent="submit">
        <label for="username">Usuario *</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          autocomplete="username"
          required
        />

        <label for="email">Correo *</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
        />

        <div class="row">
          <div>
            <label for="first_name">Nombre</label>
            <input id="first_name" v-model="form.first_name" type="text" />
          </div>
          <div>
            <label for="last_name">Apellido</label>
            <input id="last_name" v-model="form.last_name" type="text" />
          </div>
        </div>

        <label for="password">Contraseña * (mín. 6)</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          required
          minlength="6"
        />

        <label for="password_confirm">Confirmar contraseña *</label>
        <input
          id="password_confirm"
          v-model="form.password_confirm"
          type="password"
          autocomplete="new-password"
          required
        />

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Creando…' : 'Registrarse' }}
        </button>
      </form>

      <p class="footer-link">
        ¿Ya tienes cuenta?
        <RouterLink to="/sesion">Inicia sesión</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  password_confirm: '',
});

const loading = ref(false);
const error = ref('');

function formatError(d) {
  if (!d) return 'Error al registrarse';
  if (typeof d === 'string') return d;
  if (d.detail) return d.detail;
  return Object.entries(d)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join(' · ');
}

async function submit() {
  error.value = '';
  if (form.password !== form.password_confirm) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }
  loading.value = true;
  try {
    await auth.register({ ...form });
    router.push('/');
  } catch (e) {
    error.value = formatError(e.response?.data);
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
  max-width: 480px;
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

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 520px) {
  .row {
    grid-template-columns: 1fr;
  }
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
