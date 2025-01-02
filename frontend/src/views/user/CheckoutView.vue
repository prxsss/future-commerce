<script setup>
import { onMounted, reactive, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import UserLayout from '@/layouts/UserLayout.vue';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue';
import CreditCardIcon from '@/components/icons/CreditCardIcon.vue';

import { useAccountStore } from '@/stores/account';
import { useUserCartStore } from '@/stores/user/cart';
import { useUserOrderStore } from '@/stores/user/order';

const router = useRouter();
const accountStore = useAccountStore();
const userCartStore = useUserCartStore();
const userOrderStore = useUserOrderStore();

const formData = reactive({
  userId: accountStore.user.id,
  shippingAddress: '',
  shippingNote: '',
  total: 0,
});

const handleSubmit = async () => {
  try {
    await userCartStore.checkout(formData);
    await userCartStore.loadCart();
    router.push({
      name: 'checkout-success',
      params: { id: userCartStore.checkout.id },
    });
  } catch (error) {
    console.log(error);
  }
};

// watch(
//   () => userCartStore.totalPrice,
//   (totalPrice) => {
//     formData.total = totalPrice;
//   }
// );

onMounted(() => {
  formData.total = userCartStore.totalPrice;
});
</script>

<template>
  <UserLayout>
    <div class="container mx-auto">
      <div class="flex items-start">
        <!-- left side -->
        <div class="relative h-full w-1/2 flex-auto p-8">
          <h1 class="text-3xl font-bold">Checkout</h1>
          <div class="divider"></div>
          <div class="mb-6 flex items-center justify-between text-xl">
            <div>{{ accountStore.getFullName }}</div>
            <div>{{ accountStore.user.email }}</div>
          </div>
          <form @submit.prevent="handleSubmit">
            <label class="form-control mb-4">
              <div class="label">
                <span class="label-text">Address</span>
              </div>
              <textarea
                v-model="formData.shippingAddress"
                class="textarea textarea-bordered h-24"
                placeholder="Enter your address"
                required
              ></textarea>
            </label>
            <label class="form-control mb-12 w-full">
              <div class="label">
                <span class="label-text">Note</span>
              </div>
              <input
                v-model="formData.shippingNote"
                type="text"
                placeholder="Add any notes (optional)"
                class="input input-bordered w-full"
              />
            </label>
            <button type="submit" class="btn btn-primary mt-6 w-full">
              CHECKOUT
            </button>
          </form>
        </div>
        <!-- left side -->

        <!-- right side -->
        <div class="h-full w-1/2 flex-auto bg-base-200 p-8">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-3xl font-bold">Your Order</h2>
            <RouterLink :to="{ name: 'cart' }" class="">Edit Cart</RouterLink>
          </div>
          <div class="divider"></div>
          <div class="h-[400px] overflow-x-auto">
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
                <tr v-for="item in userCartStore.items">
                  <th>
                    <div class="flex items-center gap-4">
                      <img
                        class="h-[80px] w-[80px] object-cover"
                        :src="item.imgUrlSmall"
                        alt=""
                      />
                      <div class="font-normal">
                        <div class="text-sm">{{ item.name }}</div>
                      </div>
                    </div>
                  </th>
                  <td>
                    <div class="flex items-center justify-center">
                      {{ item.cartItemQuantity }}
                    </div>
                  </td>
                  <td>&#3647;{{ item.price }}</td>
                  <td>&#3647;{{ item.cartItemQuantity * item.price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="divider mt-0"></div>
          <div class="flex items-center justify-between font-medium">
            <div>SUBTOTAL COST</div>
            <div>&#3647;{{ userCartStore.totalPrice }}</div>
          </div>
          <div class="flex items-center justify-between font-medium">
            <div>SHIPPING COST</div>
            <div>&#3647;0</div>
          </div>
          <div class="flex items-center justify-between font-medium">
            <div>TOTAL COST</div>
            <div>&#3647;{{ userCartStore.totalPrice }}</div>
          </div>
        </div>
        <!-- right side -->
      </div>
    </div>
  </UserLayout>
</template>
