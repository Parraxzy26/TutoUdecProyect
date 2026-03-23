<template>
  <div class="home">
    <section class="hero">
      <h1>TutoUdec</h1>
      <p class="lead">
        Plataforma de tutorías conectada al backend Django REST Framework.
      </p>
    </section>

    <section class="stats" v-if="!loadError">
      <article>
        <span class="num">{{ stats.tutores }}</span>
        <span class="lbl">Tutores</span>
      </article>
      <article>
        <span class="num">{{ stats.materias }}</span>
        <span class="lbl">Materias</span>
      </article>
      <article v-if="auth.isAuthenticated">
        <span class="num">{{ stats.misTutorias }}</span>
        <span class="lbl">Mis tutorías</span>
      </article>
    </section>
    <p v-else class="err">{{ loadError }}</p>

    <section class="links">
      <RouterLink class="btn" to="/tutores">Ver tutores</RouterLink>
      <RouterLink class="btn secondary" to="/materias">Ver materias</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" class="btn" to="/tutorias"
        >Mis tutorías</RouterLink
      >
      <RouterLink v-else class="btn outline" to="/sesion">Iniciar sesión</RouterLink>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { tutoresApi, materiasApi, tutoriasApi } from '@/services/api';

const auth = useAuthStore();
const stats = reactive({ tutores: '—', materias: '—', misTutorias: '—' });
const loadError = ref('');

function countPayload(data) {
  if (data == null) return 0;
  if (typeof data.count === 'number') return data.count;
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data.results)) return data.results.length;
  return 0;
}

onMounted(async () => {
  loadError.value = '';
  try {
    const [tr, mt] = await Promise.all([
      tutoresApi.list({ page_size: 1 }),
      materiasApi.list({ page_size: 1 }),
    ]);
    stats.tutores = countPayload(tr.data);
    stats.materias = countPayload(mt.data);

    if (auth.isAuthenticated) {
      try {
        const mine = await tutoriasApi.misTutorias({ page_size: 1 });
        stats.misTutorias = countPayload(mine.data);
      } catch {
        stats.misTutorias = 0;
      }
    }
  } catch (e) {
    loadError.value =
      e.response?.data?.detail ||
      'No se pudo conectar con la API. ¿Está el backend en http://127.0.0.1:8000?';
  }
});
</script>

<style scoped>
.home {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.hero h1 {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
}

.lead {
  color: #555;
  font-size: 1.1rem;
  line-height: 1.5;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stats article {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #34a853;
}

.lbl {
  font-size: 0.9rem;
  color: #666;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn {
  display: inline-block;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  background: #34a853;
  color: #fff !important;
  text-decoration: none;
  font-weight: 600;
}

.btn.secondary {
  background: #3f4e65;
}

.btn.outline {
  background: transparent;
  color: #34a853 !important;
  border: 2px solid #34a853;
}

.err {
  color: #c62828;
  margin: 1rem 0;
}
</style>
