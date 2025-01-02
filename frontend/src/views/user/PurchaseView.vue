<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import UserDashboardLayout from '@/layouts/UserDashboardLayout.vue';
import RingLoader from 'vue-spinner/src/RingLoader.vue';

import { useUserOrderStore } from '@/stores/user/order';
import { useUserCartStore } from '@/stores/user/cart';

const toast = useToast();
const router = useRouter();
const userOrderStore = useUserOrderStore();
const userCartStore = useUserCartStore();

const filteredOrders = ref([]);
const searchText = ref('');

const handleSearch = (event) => {
  if (event.key === 'Enter') {
    filteredOrders.value = userOrderStore.filterOrders(searchText.value);
  }
};

const state = reactive({
  isLoading: true,
});

const handleBuyAgain = async (orderItems) => {
  try {
    console.log(orderItems);

    for (const item of orderItems) {
      const product = {
        id: item.productId,
        price: item.price,
      };

      await userCartStore.addItemToCart(product);
    }

    toast.success('Product added successfully.', {
      position: 'bottom-right',
    });

    router.push({ name: 'cart' });
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  try {
    await userOrderStore.loadOrders();
    filteredOrders.value = userOrderStore.orders;
  } catch (error) {
    console.log('error from user purchase history', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <UserDashboardLayout>
    <div
      v-if="state.isLoading"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60"
    >
      <RingLoader :loading="true" color="#fff" size="80px" />
    </div>

    <section v-else class="h-ful w-full">
      <!-- <div class="px-[1.875rem] pb-8"> -->
      <div class="pb-8">
        <div>
          <div>
            <label
              class="input input-bordered flex items-center gap-2 rounded-sm bg-base-100 shadow-lg dark:border dark:border-white"
            >
              <input
                @keyup="handleSearch($event)"
                v-model="searchText"
                type="text"
                class="grow"
                placeholder="You can search by Order ID"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="h-4 w-4 opacity-70"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </label>
          </div>
          <!-- Purchase history listings -->
          <div
            v-for="order in filteredOrders"
            class="my-3 rounded-sm bg-base-100 shadow-lg dark:border dark:border-white"
          >
            <div>
              <div class="px-[1.875rem] pb-3 pt-6">
                <div>
                  <div class="flex items-center justify-between pb-3">
                    <!-- Left side -->
                    <div class="flex items-center">
                      <i class="pi pi-shop"></i>
                      <div class="ml-2 text-sm font-[600]">Future Commerce</div>
                    </div>
                    <!-- Left side -->

                    <!-- Right side -->
                    <div class="flex items-center">
                      <RouterLink
                        :to="{
                          name: 'checkout-success',
                          params: { id: order.orderId },
                        }"
                        class="mr-[0.625rem] border-r border-[rgba(0,0,0,.12)] pr-[0.625rem]"
                      >
                        <div class="text-navy-700 text-sm">
                          <i
                            class="pi pi-truck mb-[0.0625rem] mr-1 align-middle"
                          ></i>
                          The parcel was successfully delivered:
                          {{ order.shippingAddress }}
                        </div>
                      </RouterLink>
                      <div
                        class="text-navy-500 whitespace-nowrap text-right text-sm uppercase"
                      >
                        Completed
                      </div>
                    </div>
                    <!-- Right side -->
                  </div>
                  <div class="divider mt-0"></div>
                  <div
                    class="space-y-6 [&>a:not(:first-child)]:border-t [&>a:not(:first-child)]:border-[rgba(0,0,0,.12)] [&>a:not(:first-child)]:pt-4"
                  >
                    <!-- row 1 -->
                    <RouterLink
                      :to="{
                        name: 'checkout-success',
                        params: { id: order.orderId },
                      }"
                      v-for="item in order.orderItems"
                      class="flex items-center justify-between"
                    >
                      <div class="flex items-center space-x-6">
                        <div class="avatar">
                          <div class="h-[100px] w-[100px] rounded">
                            <img
                              class="object-cover"
                              :src="item.imgUrlSmall"
                              :alt="item.name"
                            />
                          </div>
                        </div>
                        <div>
                          {{ item.name }}
                          <br />
                          <span class="badge badge-ghost badge-sm"
                            >x<span>
                              {{ item.quantity }}
                            </span></span
                          >
                        </div>
                      </div>
                      <div>
                        &#3647;<span>{{ item.price }}</span>
                      </div>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider mt-0"></div>

            <div class="px-6 pb-3 pt-6">
              <div class="flex items-center justify-end">
                <label class="mr-[0.625rem]">Order Total: </label>
                <div class="text-navy-700 text-xl font-[700]">
                  &#3647;{{ order.total }}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between px-6 pb-6 pt-3">
              <div>
                <div class="hidden text-left text-xs text-[rgba(0,0,0,.54)]">
                  Cancelled by you
                </div>
              </div>

              <div class="flex [&>button]:ml-[0.625rem]">
                <button
                  @click="handleBuyAgain(order.orderItems)"
                  class="btn btn-primary"
                >
                  Buy Again
                </button>
                <button
                  class="border-navy-500 text-navy-500 hover:bg-navy-500 hidden h-[40px] rounded border px-5 font-[500] transition-all hover:text-white"
                >
                  View Cancellation Details
                </button>
                <button
                  class="border-navy-500 text-navy-500 hover:bg-navy-500 hidden h-[40px] rounded border px-5 font-[500] transition-all hover:text-white"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
          <!-- Purchase history listings -->
        </div>
      </div>
    </section>
  </UserDashboardLayout>
</template>
