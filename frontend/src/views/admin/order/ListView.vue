<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';

import { useOrderStore } from '@/stores/admin/order';

const orderStore = useOrderStore();

onMounted(() => {
  console.log('orders', orderStore.orders);
});
</script>

<template>
  <AdminLayout>
    <div class="p-14">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-semibold">Order Management</div>
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
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <!-- <th>Items</th> -->
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="order in orderStore.orders">
              <th>{{ order.orderId }}</th>
              <td>{{ order.userFullName }}</td>
              <td>&#3647;{{ order.total }}</td>
              <!-- <td></td> -->
              <td>
                <span
                  :class="[
                    'rounded-full px-3 py-1 text-sm font-light capitalize',
                    {
                      'bg-blue-100 text-blue-800': order.status === 'shipped',
                      'bg-yellow-100 text-yellow-800':
                        order.status === 'processing',
                      'bg-gray-100 text-gray-800': order.status === 'pending',
                    },
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
              <td>
                <div class="flex items-center">
                  <RouterLink
                    :to="{
                      name: 'admin-orders-detail',
                      params: { id: order.orderId },
                    }"
                    class="text-primary"
                  >
                    <i class="pi pi-eye"></i>
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
