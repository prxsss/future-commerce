<script setup>
import { RouterLink } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';

import { useProductStore } from '@/stores/admin/product';
import { useUserStore } from '@/stores/admin/user';

const productStore = useProductStore();
const userStore = useUserStore();

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
        <div class="text-2xl font-semibold">User</div>
        <!-- <RouterLink :to="{ name: 'admin-products-add' }" class="btn btn-primary"
          >Add New</RouterLink
        > -->
      </div>
      <div class="divider"></div>
      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Role</th>
              <!-- <th>Status</th> -->
              <th>Updated At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="user in userStore.users">
              <th>{{ user.firstName }} {{ user.lastName }}</th>
              <!-- <td>
                <div>
                  <img
                    class="h-[80px] w-[80px] rounded object-cover"
                    :src="item.imgUrlSmall"
                    alt=""
                  />
                </div>
              </td> -->
              <td>{{ user.isAdmin ? 'Admin' : 'User' }}</td>
              <td>{{ new Date(user.updatedAt).toLocaleString() }}</td>
              <td>
                <div class="flex items-center">
                  <RouterLink
                    :to="{
                      name: 'admin-users-update',
                      params: { id: user.id },
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
