import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AuthSignInView from '@/views/AuthSignInView.vue';
import AuthSignUpView from '@/views/AuthSignUpView.vue';
import useAuthStore from '@/store/auth';
import AuthorTableView from '@/views/AuthorTableView.vue';
import UserTableView from '@/views/UserTableView.vue';
import { RoleType } from '@/util/enum/RoleType';
import SubjectTableView from '@/views/SubjectTableView.vue';
import BookDetailsView from '@/views/BookDetailsView.vue';
import LoanTableView from '@/views/LoanTableView.vue';
import BookCopyTableView from '@/views/BookCopyTableView.vue';
import SanctionTableView from '@/views/SanctionTableView.vue';
import ReportsView from '@/views/ReportsView.vue';

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
      path: '/book',
      name: 'bookDetails',
      component: BookDetailsView,
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
    {
      path: '/subject',
      name: 'subjectTable',
      component: SubjectTableView,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: '/book-copy',
      name: 'bookCopyTable',
      component: BookCopyTableView,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: '/loan',
      name: 'loanTable',
      component: LoanTableView,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: '/sanction',
      name: 'sanctionTable',
      component: SanctionTableView,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: '/user',
      name: 'userTable',
      component: UserTableView,
      meta: {
        requireAuth: true,
        restringed: true,
        admin: true,
        librarian: false,
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: {
        requireAuth: true,
        restringed: true,
        admin: true,
        librarian: false,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();
  const isAuth = store.token;

  if (!to.meta.requireAuth) next();
  else if (isAuth !== null) {
    if (to.meta.restringed) {
      await store.refresh();
      const role = store.role;
      if (
        (role === 'Admin' && to.meta.admin) ||
        (role === 'Librarian' && to.meta.librarian)
      )
        next();
      else throw new Error('Unhautorized');
    } else next();
  } else next({ name: 'signin' });
});

export default router;
