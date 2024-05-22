import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AuthSignInView from '@/views/AuthSignInView.vue';
import AuthSignUpView from '@/views/AuthSignUpView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth/signin',
      name: 'signin',
      component: AuthSignInView,
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: AuthSignUpView,
    },
  ],
});

export default router;
