<script setup>
import { RouterLink } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';

import { useOrderStore } from '@/stores/admin/order';

const orderStore = useOrderStore();
</script>

<template>
  <AdminLayout>
    <div class="p-14">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-semibold">Order</div>
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
              <th>Customer Name</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="order in orderStore.orders">
              <th>{{ order.userFullName }}</th>
              <!-- <td>
                <div>
                  <img
                    class="h-[80px] w-[80px] rounded object-cover"
                    :src="item.imgUrlSmall"
                    alt=""
                  />
                </div>
              </td> -->
              <td>{{ order.total }}</td>
              <td>Payment Completed</td>
              <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
              <td>
                <div class="flex items-center">
                  <RouterLink
                    :to="{
                      name: 'admin-orders-detail',
                      params: { id: order.orderId },
                    }"
                  >
                    <!-- <PenToSquareIcon class="h-[20px] w-[20px]" /> -->
                    <button class="btn btn-primary">SEE DETAIL</button>
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
