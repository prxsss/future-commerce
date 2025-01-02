<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import UserLayout from '@/layouts/UserLayout.vue';
import ProductListings from '@/components/ProductListings.vue';

import { useUserProductStore } from '@/stores/user/product';
import { useUserCartStore } from '@/stores/user/cart';
import { useAccountStore } from '@/stores/account';

const router = useRouter();
const toast = useToast();
const userProductStore = useUserProductStore();
const userCartStore = useUserCartStore();
const accountStore = useAccountStore();

const addItemToCart = (product) => {
  if (accountStore.isLoggedIn) {
    userCartStore.addItemToCart(product);
    toast.success('Product added successfully.', {
      position: 'bottom-right',
    });
  } else {
    router.push({ name: 'login' });
  }
};

// onMounted(async () => {
//   try {
//     await userProductStore.loadProducts();
//   } catch (error) {
//     console.log(error);
//   }
// });
</script>

<template>
  <UserLayout>
    <!-- Hero -->
    <div
      class="hero mb-10 h-[375px] bg-base-200"
      style="background-image: url('src/assets/img/hero-bg-img.jpeg')"
    >
      <div class="hero-overlay bg-opacity-60"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">Welcome to Future-Commerce</h1>
          <p class="mb-5">
            Shop smarter, faster, and with more choice than ever before.
            Experience a seamless journey from browsing to checkout.
            Future-Commerce — where the future of online shopping begins!
          </p>
        </div>
      </div>
    </div>
    <!-- <section class="hero mb-10 h-[375px] bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Welcome to Future-Commerce</h1>
          <p class="py-6">
            Shop smarter, faster, and with more choice than ever before.
            Experience a seamless journey from browsing to checkout.
            Future-Commerce — where the future of online shopping begins!
          </p>
        </div>
      </div>
    </section> -->
    <!-- Hero -->

    <!-- Product Listings -->
    <ProductListings
      :products="userProductStore.products"
      :addItemToCart="addItemToCart"
    />
    <!-- Product Listings -->
  </UserLayout>
</template>
