<script setup>
import { watch, ref } from 'vue';
import { useRoute } from 'vue-router';

import UserLayout from '@/layouts/UserLayout.vue';
import ProductListings from '@/components/ProductListings.vue';

import { useUserProductStore } from '@/stores/user/product';

const route = useRoute();
const productStore = useUserProductStore();

const searchText = ref('');
const filteredProduct = ref([]);

watch(
  () => route.query.q,
  (newSearchText) => {
    searchText.value = newSearchText;
    filteredProduct.value = productStore.filterProducts(searchText.value);
  },
  { immediate: true }
);
</script>

<template>
  <UserLayout>
    <div>
      Search result for '<span class="font-bold">{{ searchText }}</span
      >'
    </div>
    <div v-if="filteredProduct.length > 0">
      <ProductListings :products="filteredProduct" />
    </div>
    <div
      v-else
      class="grid h-[500px] place-content-center text-center text-3xl"
    >
      <div class="font-bold">No Products Found</div>
      <div>Your search did not match any products.</div>
      <div>Please try again.</div>
    </div>
  </UserLayout>
</template>
