import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AuthSignInView from '@/views/AuthSignInView.vue';
import AuthSignUpView from '@/views/AuthSignUpView.vue';
import AuthorTableView from '@/views/AuthorTableView.vue';
import useAuthStore from '@/store/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: '/auth/signin',
      name: 'signin',
      component: AuthSignInView,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: AuthSignUpView,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: '/author',
      name: 'authorTable',
      component: AuthorTableView,
      meta: {
        requireAuth: false,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = useAuthStore();
  const isAuth = store.token;

  if (to.meta.requireAuth && isAuth === null) next({name: 'signin'});
  else next();
});

export default router;
