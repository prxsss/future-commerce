<script setup>
import { onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

import UserLayout from '@/layouts/UserLayout.vue';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue';

import { useUserCartStore } from '@/stores/user/cart';
import { useUserProductStore } from '@/stores/user/product';
import { useAccountStore } from '@/stores/account';

const router = useRouter();
const userCartStore = useUserCartStore();
const userProductStore = useUserProductStore();
const accountStore = useAccountStore();

const shippingOptions = [
  {
    name: 'Fast Shipping',
    price: 38,
  },
  {
    name: 'Standard Delivery Bulky',
    price: 110,
  },
];

onMounted(() => {
  if (!accountStore.isLoggedIn) {
    router.push({ name: 'login' });
  }
});
</script>

<template>
  <UserLayout>
    <div class="container mx-auto">
      <div class="flex items-start">
        <!-- left side -->
        <div class="relative h-full w-96 flex-auto p-8">
          <div class="flex items-center justify-between text-3xl font-bold">
            <h1>Shopping Cart</h1>
            <div>{{ userCartStore.totalQuantity }} Items</div>
          </div>
          <div class="divider"></div>
          <div class="h-[460px] overflow-x-auto">
            <table class="table table-pin-rows">
              <thead>
                <tr>
                  <th>PRODUCT DETAILS</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in userCartStore.items">
                  <th>
                    <div class="flex gap-4">
                      <img
                        class="h-[100px] w-[100px] object-cover"
                        :src="item.imgUrlSmall"
                        :alt="item.name"
                      />
                      <div class="font-normal">
                        <div class="text-sm">{{ item.name }}</div>
                        <button
                          @click="userCartStore.removeItemInCart(index)"
                          class="text-xs text-gray-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </th>
                  <td>
                    <select
                      v-model="item.cartItemQuantity"
                      @change="
                        userCartStore.updateItemInCart(
                          index,
                          $event.target.value
                        )
                      "
                      class="select select-bordered w-full"
                    >
                      <option v-for="quantity in item.productQuantity">
                        {{ quantity }}
                      </option>
                    </select>
                  </td>
                  <td>&#3647;{{ item.price }}</td>
                  <td>&#3647;{{ item.cartItemQuantity * item.price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <RouterLink
            :to="{ name: 'home' }"
            class="absolute bottom-8 left-8 flex items-center gap-2"
          >
            <ArrowLeftIcon class="h-[20px] w-[20px]" /> Continue Shopping
          </RouterLink> -->
        </div>
        <!-- left side -->

        <!-- right side -->
        <div class="h-full w-32 flex-auto bg-base-200 p-8">
          <div class="text-3xl font-bold">
            <h2>Order Summary</h2>
          </div>
          <div class="divider"></div>
          <div class="mb-8 flex items-center justify-between font-medium">
            <div>{{ userCartStore.items.length }} ITEMS</div>
            <div>&#3647;{{ userCartStore.totalPrice }}</div>
          </div>
          <div class="mb-8">
            <div class="mb-4 font-medium">SHIPPING</div>
            <select class="select select-bordered w-full">
              <option disabled selected>Select Shipping Option</option>
              <option v-for="shipping in shippingOptions">
                {{ shipping.name }} - &#3647;{{ shipping.price }}
              </option>
            </select>
          </div>
          <div class="mb-8">
            <div class="mb-4 font-medium">PROMO CODE</div>
            <input
              type="text"
              placeholder="Enter your code"
              class="input input-bordered mb-4 w-full"
            />
            <button class="btn btn-primary">APPLY</button>
          </div>
          <div class="divider"></div>
          <div class="mb-8 flex items-center justify-between font-medium">
            <div>TOTAL COST</div>
            <div>&#3647;{{ userCartStore.totalPrice }}</div>
          </div>
          <RouterLink :to="{ name: 'checkout' }" class="btn btn-primary w-full"
            >CHECKOUT</RouterLink
          >
        </div>
        <!-- right side -->
      </div>
    </div>
  </UserLayout>
</template>
