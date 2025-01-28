<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';
import RingLoader from 'vue-spinner/src/RingLoader.vue';

import { useOrderStore } from '@/stores/admin/order';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const orderId = ref(-1);

const state = reactive({
  orderData: {},
  isLoading: true,
});

const handleAlert = (message) => {
  alert(message);
};

onMounted(async () => {
  try {
    if (route.params.id) {
      orderId.value = parseInt(route.params.id);
      state.orderData = orderStore.getOrderById(orderId.value);
    }

    // if (!accountStore.isLoggedIn) {
    //   router.push({ name: 'login' });
    // }
    // state.orderData = await orderStore.getOrderById(route.params.id);
  } catch (error) {
    console.log(error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <AdminLayout>
    <div class="space-y-6 p-14">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-2xl font-semibold">
          <RouterLink :to="{ name: 'admin-orders-list' }"
            ><i class="pi pi-arrow-left"></i
          ></RouterLink>
          <h1>Order Details #{{ orderId }}</h1>
        </div>
        <div class="space-x-4">
          <button @click="handleAlert('Feature comming soon...')" class="btn">
            <i class="pi pi-print"></i> Print</button
          ><button @click="handleAlert('Feature comming soon...')" class="btn">
            <i class="pi pi-download"></i> Download
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between rounded-xl border p-6">
        <div>
          <p>Order Status</p>
          <span
            :class="[
              'rounded-full px-3 py-1 text-sm font-light capitalize',
              {
                'bg-blue-100 text-blue-800':
                  state.orderData.status === 'shipped',
                'bg-yellow-100 text-yellow-800':
                  state.orderData.status === 'processing',
                'bg-gray-100 text-gray-800':
                  state.orderData.status === 'pending',
              },
            ]"
            >{{ state.orderData.status }}</span
          >
        </div>
        <div>
          <p>Order Date</p>
          <p>{{ new Date(state.orderData.createdAt).toLocaleString() }}</p>
        </div>
      </div>

      <div class="rounded-xl border">
        <div class="p-6">
          <h3 class="font-semibold leading-none tracking-tight">
            Customer Infomation
          </h3>
        </div>
        <div class="px-6 pb-6">
          <div class="space-y-2">
            <p><strong>Name:</strong> {{ state.orderData.userFullName }}</p>
            <p><strong>Email:</strong> -</p>
            <p><strong>Phone:</strong> -</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border">
        <div class="p-6">
          <h3 class="font-semibold leading-none tracking-tight">
            Shipping Infomation
          </h3>
        </div>
        <div class="px-6 pb-6">
          <div class="space-y-2">
            <p>
              <strong>Address:</strong> {{ state.orderData.shippingAddress }}
            </p>
            <p><strong>Method:</strong> -</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border">
        <div class="p-6">
          <h3 class="font-semibold leading-none tracking-tight">Order Items</h3>
        </div>
        <div class="px-6 pb-6">
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in state.orderData.orderItems"
                  :key="index"
                >
                  <th>{{ item.name }}</th>
                  <td>&#3647;{{ item.price.toLocaleString() }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>
                    &#3647;{{ (item.price * item.quantity).toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="rounded-xl border">
        <div class="p-6">
          <h3 class="font-semibold leading-none tracking-tight">
            Order Summary
          </h3>
        </div>
        <div class="px-6 pb-6">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span>Subtotal</span>
              <span>&#3647;{{ state.orderData.total.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Shipping</span>
              <span>&#3647;0</span>
            </div>
            <div
              class="flex items-center justify-between border-t pt-2 text-lg font-bold"
            >
              <span>Total</span>
              <span>&#3647;{{ state.orderData.total.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
