<script setup>
import { ref, onMounted } from 'vue'
import { API } from '../services/api.js'

const mensaje = ref('')
const error = ref(false)

onMounted(async () => {
  try {
    const res = await API.get('/saludo/')
    mensaje.value = res.data.message
  } catch (e) {
    console.error(e)
    error.value = true
    mensaje.value = 'No se pudo conectar con el servidor'
  }
})
</script>

<template>
  <div>
    <h1 class="green">{{ error ? mensaje : mensaje }}</h1>
  </div>
</template>