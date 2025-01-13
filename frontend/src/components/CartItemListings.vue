<script setup>
import CartItemListing from '@/components/CartItemListing.vue';

const props = defineProps({
  items: Array,
});
</script>

<template>
  <tr v-for="(item, index) in items" :key="item.cartItemId">
    <CartItemListing :item="item" :index="index" />
  </tr>
</template>
