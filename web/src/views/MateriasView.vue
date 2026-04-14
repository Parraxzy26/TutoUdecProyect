<template>
  <div class="page">
    <h1>Materias</h1>
    <p class="muted">Catálogo desde la API</p>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="muted">Cargando…</p>

    <ul v-else class="list">
      <li v-for="m in items" :key="m.id" class="item">
        <strong>{{ m.nombre }}</strong>
        <p v-if="m.descripcion" class="desc">{{ m.descripcion }}</p>
        <span class="badge">{{ m.total_tutorias ?? 0 }} tutorías</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { materiasApi } from '@/services/api';

const items = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const { data } = await materiasApi.list({ page_size: 100 });
    items.value = data.results ?? data;
  } catch (e) {
    error.value =
      e.response?.data?.detail || 'No se pudieron cargar las materias';
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
}

.desc {
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
}

.badge {
  display: inline-block;
  font-size: 0.85rem;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}
</style>
