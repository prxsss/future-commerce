<script setup>
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import UserLayout from '@/layouts/UserLayout.vue';
import RingLoader from 'vue-spinner/src/RingLoader.vue';

import { useAccountStore } from '@/stores/account';
import { useUserCartStore } from '@/stores/user/cart';
import { useUserOrderStore } from '@/stores/user/order';

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const userCartStore = useUserCartStore();
const userOrderStore = useUserOrderStore();

const state = reactive({
  orderData: {},
  isLoading: true,
});

onMounted(async () => {
  try {
    if (!accountStore.isLoggedIn) {
      router.push({ name: 'login' });
    }

    state.orderData = await userOrderStore.getOrderById(route.params.id);
  } catch (error) {
    console.log(error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <UserLayout>
    <div
      v-if="state.isLoading"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60"
    >
      <RingLoader :loading="true" color="#fff" size="80px" />
    </div>

    <div v-else class="mx-auto max-w-4xl">
      <div class="p-6 shadow-md">
        <h1 class="text-3xl font-semibold">Your order is successful!</h1>
        <div>Hello, {{ accountStore.getFullName }}</div>
        <div>Get ready to receive your products</div>
        <div class="divider"></div>
        <div class="flex justify-between">
          <div>
            <div class="font-bold">Order Date</div>
            <div>
              {{ new Date(state.orderData.createdAt).toLocaleString() }}
            </div>
          </div>
          <div>
            <div class="font-bold">Order Number</div>
            <div class="mx-auto w-fit">{{ state.orderData.id }}</div>
          </div>
          <div>
            <div class="font-bold">Payment Method</div>
            <div>Promptpay</div>
          </div>
          <div class="w-2/6">
            <div class="font-bold">Address</div>
            <div>{{ state.orderData.shippingAddress }}</div>
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
        <div>Thank you for choose Future Commerce</div>
      </div>
    </div>
  </UserLayout>
</template>
