<template>
  <div class="page">
    <h1>Mis tutorías</h1>
    <p class="muted">Requiere haber iniciado sesión</p>

    <p v-if="!auth.isAuthenticated" class="warn">
      <RouterLink to="/sesion">Inicia sesión</RouterLink> para ver tus tutorías.
    </p>

    <template v-else>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="loading" class="muted">Cargando…</p>

      <ul v-else class="list">
        <li v-for="t in items" :key="t.id" class="item">
          <div class="row">
            <strong>{{ t.materia_nombre || 'Materia' }}</strong>
            <span class="estado">{{ t.estado }}</span>
          </div>
          <div class="meta">
            <span>Tutor: {{ t.tutor_nombre }}</span>
            <span>{{ formatDate(t.fecha_inicio) }}</span>
          </div>
        </li>
      </ul>
      <p v-if="!loading && items.length === 0" class="muted">
        No tienes tutorías registradas.
      </p>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { tutoriasApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const items = ref([]);
const loading = ref(false);
const error = ref('');

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-CO');
  } catch {
    return iso;
  }
}

async function load() {
  if (!auth.isAuthenticated) return;
  loading.value = true;
  error.value = '';
  try {
    const { data } = await tutoriasApi.misTutorias();
    items.value = data.results ?? data;
  } catch (e) {
    error.value =
      e.response?.data?.detail || 'No se pudieron cargar tus tutorías';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(
  () => auth.isAuthenticated,
  (v) => {
    if (v) load();
    else items.value = [];
  }
);
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

h1 {
  margin-bottom: 0.25rem;
}

.muted {
  color: #666;
}

.warn {
  background: #fff8e1;
  padding: 1rem;
  border-radius: 8px;
}

.error {
  color: #c62828;
}

.list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
}

.item {
  background: #fff;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.estado {
  text-transform: capitalize;
  font-size: 0.85rem;
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.meta {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #555;
}
</style>
