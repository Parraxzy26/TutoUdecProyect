<template>
  <div class="page">
    <h1>Tutores</h1>
    <p class="muted">Listado desde la API (paginado)</p>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="muted">Cargando…</p>

    <ul v-else class="list">
      <li v-for="t in items" :key="t.id" class="item">
        <div>
          <strong>{{ t.usuario_nombre || 'Sin nombre' }}</strong>
          <span class="muted"> · {{ t.especialidad }}</span>
        </div>
        <div class="meta">
          <span>⭐ {{ Number(t.calificacion ?? 0).toFixed(1) }}</span>
          <span>${{ t.tarifa_por_hora }}/h</span>
          <span :class="t.disponible ? 'ok' : 'no'">{{
            t.disponible ? 'Disponible' : 'No disponible'
          }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { tutoresApi } from '@/services/api';

const items = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await tutoresApi.list({ page_size: 50 });
    items.value = data.results ?? data;
  } catch (e) {
    error.value =
      e.response?.data?.detail || 'No se pudieron cargar los tutores';
  } finally {
    loading.value = false;
  }
});
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
}

.ok {
  color: #2e7d32;
  font-weight: 600;
}

.no {
  color: #c62828;
  font-weight: 600;
}
</style>
