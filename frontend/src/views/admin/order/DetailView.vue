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
    <div
      v-if="state.isLoading"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60"
    >
      <RingLoader :loading="true" color="#fff" size="80px" />
    </div>

    <div v-else class="flex h-full flex-col p-14">
      <div class="p-6 shadow-md">
        <h1 class="text-3xl font-semibold">Order Detail ID: {{ orderId }}</h1>
        <div class="mt-2">Order by: {{ state.orderData.userFullName }}</div>
        <!-- <div>Hello, {{ accountStore.getFullName }}</div>
        <div>Get ready to receive your products</div> -->
        <div class="divider"></div>
        <div>
          <div class="mb-4 flex items-center">
            <div class="w-1/2">
              <div class="font-bold">Order Date</div>
              <div>
                {{ new Date(state.orderData.createdAt).toLocaleString() }}
              </div>
            </div>
            <div class="w-1/2">
              <div class="font-bold">Order Number</div>
              <div class="w-fit">{{ state.orderData.orderId }}</div>
            </div>
          </div>
          <div class="flex">
            <div class="w-1/2">
              <div class="font-bold">Payment Method</div>
              <div>Promptpay</div>
            </div>
            <div class="w-1/2">
              <div class="font-bold">Address</div>
              <div>{{ state.orderData.shippingAddress }}</div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="space-y-8">
          <div
            v-for="item in state.orderData.orderItems"
            class="flex items-center gap-4"
          >
            <img
              class="h-[100px] w-[100px] object-cover"
              :src="item.imgUrlSmall"
              alt=""
            />
            <div class="flex flex-auto items-center justify-between">
              <div>
                <div>{{ item.name }}</div>
                <div>x{{ item.quantity }}</div>
              </div>
              <div>&#3647;{{ item.price }}</div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="flex items-center justify-between font-medium">
          <div>Subtotal Cost</div>
          <div>&#3647;{{ state.orderData.total }}</div>
        </div>
        <div class="flex items-center justify-between font-medium">
          <div>Shipping Cost</div>
          <div>&#3647;0</div>
        </div>
        <div class="divider"></div>
        <div class="flex items-center justify-between font-medium">
          <div>Total Cost</div>
          <div>&#3647;{{ state.orderData.total }}</div>
        </div>
        <div class="divider"></div>
        <div class="flex items-center justify-end">
          <RouterLink :to="{ name: 'admin-orders-list' }"
            ><button class="btn btn-primary">Back</button></RouterLink
          >
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
