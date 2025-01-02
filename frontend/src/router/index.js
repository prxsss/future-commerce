import { createRouter, createWebHistory } from 'vue-router';
import { useAccountStore } from '@/stores/account';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/user/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/user/RegisterView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/user/SearchView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/user/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/user/CheckoutView.vue'),
    },
    {
      path: '/purchase/order/:id',
      name: 'checkout-success',
      component: () => import('@/views/user/SuccessView.vue'),
    },
    {
      path: '/purchase',
      name: 'purchase-history',
      component: () => import('@/views/user/PurchaseView.vue'),
    },
    {
      path: '/profile',
      name: 'user-profile',
      component: () => import('@/views/user/ProfileView.vue'),
    },
    // Admin Routes
    {
      path: '/admin/signin',
      name: 'admin-signin',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/DashboardView.vue'),
    },
    {
      path: '/admin/products',
      name: 'admin-products-list',
      component: () => import('@/views/admin/product/ListView.vue'),
    },
    {
      path: '/admin/products/add',
      name: 'admin-products-add',
      component: () => import('@/views/admin/product/UpdateView.vue'),
    },
    {
      path: '/admin/products/update/:id',
      name: 'admin-products-update',
      component: () => import('@/views/admin/product/UpdateView.vue'),
    },
    {
      path: '/admin/orders',
      name: 'admin-orders-list',
      component: () => import('@/views/admin/order/ListView.vue'),
    },
    {
      path: '/admin/orders/:id',
      name: 'admin-orders-detail',
      component: () => import('@/views/admin/order/DetailView.vue'),
    },
    {
      path: '/admin/users',
      name: 'admin-users-list',
      component: () => import('@/views/admin/user/ListView.vue'),
    },
    {
      path: '/admin/users/update/:id',
      name: 'admin-users-update',
      component: () => import('@/views/admin/user/UpdateView.vue'),
    },
    {
      path: '/admin/signout',
      name: 'admin-signout',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/test/upload',
      name: 'test-upload',
      component: () => import('@/views/user/TestUploadView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  console.log('from', from);
  console.log('to', to);

  const accountStore = useAccountStore();
  await accountStore.checkAuth();
  next();
});

export default router;
