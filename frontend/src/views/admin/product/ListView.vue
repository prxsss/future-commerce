<script setup>
import { RouterLink } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';
import PenToSquareIcon from '@/components/icons/PenToSquareIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';

import { useProductStore } from '@/stores/admin/product';

const productStore = useProductStore();

const deleteProduct = async (id) => {
  try {
    await productStore.deleteProduct(id);
    await productStore.loadProducts();
  } catch (error) {
    console.log(error.response.data);
  }
};
</script>

<template>
  <AdminLayout>
    <div class="p-14">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-semibold">Product</div>
        <RouterLink :to="{ name: 'admin-products-add' }" class="btn btn-primary"
          >Add New</RouterLink
        >
      </div>
      <div class="divider"></div>
      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Updated At</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="item in productStore.items">
              <th>{{ item.name }}</th>
              <td>
                <div>
                  <img
                    class="h-[80px] w-[80px] rounded object-cover"
                    :src="item.imgUrlSmall"
                    alt=""
                  />
                </div>
              </td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ new Date(item.updatedAt).toLocaleString() }}</td>
              <td>
                <div class="flex items-center">
                  <RouterLink
                    :to="{
                      name: 'admin-products-update',
                      params: { id: item.id },
                    }"
                  >
                    <!-- <PenToSquareIcon class="h-[20px] w-[20px]" /> -->
                    <i
                      class="pi pi-pen-to-square"
                      style="font-size: 1.25rem"
                    ></i>
                  </RouterLink>
                </div>
              </td>
              <td>
                <div class="flex items-center">
                  <button @click="deleteProduct(item.id)">
                    <!-- <TrashIcon class="h-[20px] w-[20px]" /> -->
                    <i class="pi pi-trash" style="font-size: 1.25rem"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
