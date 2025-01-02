<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';

import { useProductStore } from '@/stores/admin/product';
import { useUserProductStore } from '@/stores/user/product';
import { useAccountStore } from '@/stores/account';
import { useUserCartStore } from '@/stores/user/cart';
import { useUserStore } from '@/stores/admin/user';
import { useOrderStore } from './stores/admin/order';

const router = useRouter();
const productStore = useProductStore();
const userProductStore = useUserProductStore();
const accountStore = useAccountStore();
const userCartStore = useUserCartStore();
const userStore = useUserStore();
const orderStore = useOrderStore();

onMounted(async () => {
  try {
    await router.isReady();

    console.log('App mounted');

    // await accountStore.checkAuth();
    await userProductStore.loadProducts();
    await productStore.loadProducts();
    await userCartStore.loadCart();
    await userStore.loadUsers();
    await orderStore.loadOrder();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <RouterView />
</template>
