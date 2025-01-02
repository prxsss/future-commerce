<script setup>
import { useUserProductStore } from '@/stores/user/product';
// import { useUserCartStore } from '@/stores/cart';

const productStore = useUserProductStore();
// const cartStore = useUserCartStore();

defineProps({
  products: Array,
  addItemToCart: Function,
});
</script>

<template>
  <section class="grid grid-cols-4 gap-10">
    <div
      v-for="product in products"
      class="card bg-base-100 shadow-xl dark:border dark:border-white"
    >
      <figure>
        <img :src="product.imgUrlLarge" alt="Shoes" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <div class="card-actions items-center justify-between">
          <div class="badge text-xl">&#3647;{{ product.price }}</div>
          <button @click="addItemToCart(product)" class="btn btn-primary">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
