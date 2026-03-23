import { createRouter, createWebHistory } from 'vue-router';
import BaseLayout from '../components/layout/BaseLayout.vue';
import HomeView from '../views/HomeView.vue';
import Sesion from '../components/pages/Sesion.vue';
import Formulario from '../components/pages/Formulario.vue';
import TutoresView from '../views/TutoresView.vue';
import MateriasView from '../views/MateriasView.vue';
import TutoriasView from '../views/TutoriasView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'sesion',
          name: 'sesion',
          component: Sesion,
          meta: { guestOnly: true },
        },
        {
          path: 'formulario',
          name: 'formulario',
          component: Formulario,
          meta: { guestOnly: true },
        },
        {
          path: 'tutores',
          name: 'tutores',
          component: TutoresView,
        },
        {
          path: 'materias',
          name: 'materias',
          component: MateriasView,
        },
        {
          path: 'tutorias',
          name: 'tutorias',
          component: TutoriasView,
          meta: { requiresAuth: true },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/Aboutview.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'sesion', query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' };
  }
  return true;
});

export default router;
