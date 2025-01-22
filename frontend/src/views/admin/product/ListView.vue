<script setup>
import { RouterLink } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';

import { useProductStore } from '@/stores/admin/product';

const productStore = useProductStore();

const deleteProduct = async (id) => {
  try {
    if (confirm('Are you sure you want to delete this product?')) {
      await productStore.deleteProduct(id);
      await productStore.loadProducts();
    }
  } catch (error) {
    console.log(error.response.data);
  }
};
</script>

<template>
  <AdminLayout>
    <div class="p-14">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-semibold">Product Management</div>
        <RouterLink
          :to="{ name: 'admin-products-add' }"
          class="btn btn-primary text-base"
        >
          <i class="pi pi-plus" style="font-size: 1rem; font-weight: bold"></i>
          Add New Product
        </RouterLink>
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
              <th>Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
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
              <td>
                <div class="badge badge-success gap-2">In Stock</div>
              </td>
              <td>{{ new Date(item.updatedAt).toLocaleString() }}</td>
              <td>
                <div class="flex items-center gap-4">
                  <div class="flex items-center">
                    <RouterLink
                      :to="{
                        name: 'admin-products-update',
                        params: { id: item.id },
                      }"
                      class="text-primary"
                    >
                      <i
                        class="pi pi-pen-to-square"
                        style="font-size: 1.25rem"
                      ></i>
                    </RouterLink>
                  </div>
                  <div class="flex items-center">
                    <button @click="deleteProduct(item.id)" class="text-error">
                      <i class="pi pi-trash" style="font-size: 1.25rem"></i>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
