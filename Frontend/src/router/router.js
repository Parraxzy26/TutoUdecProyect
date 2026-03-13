import { createRouter, createWebHistory } from "vue-router";
import BaseLayout from "../components/layout/BaseLayout.vue";
import Home from "../components/Home.vue";
import Sesion from "../components/Pages/Sesion.vue";
import Formulario from "../components/Pages/Formulario.vue"

const routes = [
  {
    path: "/",
    component: BaseLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
      {
        path: "/sesion",
        name: "Sesion",
        component: Sesion,
      },
      {
        path: "/formulario",
        name: "Formulario",
        component: Formulario,
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;