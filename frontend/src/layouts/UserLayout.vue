<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';

import { useAccountStore } from '@/stores/account';
import { useUserCartStore } from '@/stores/user/cart';

const router = useRouter();
const route = useRoute();
const accountStore = useAccountStore();
const userCartStore = useUserCartStore();

const searchText = ref('');
// const activePage = ref('');

const handleSearch = (event) => {
  if (event.key === 'Enter') {
    router.push({ name: 'search', query: { q: searchText.value } });
  }
};

const signOut = async () => {
  if (window.confirm('Are you sure you want to logout?')) {
    await accountStore.signOut();
    localStorage.clear();
    sessionStorage.clear();
    router.push({ name: 'login' });
  }
};

// onMounted(() => {
//   if (route.name === 'home') {
//     isHomePage.value = true;
//   }
// });
</script>

<template>
  <!-- Navbar -->
  <div class="mb-10 bg-base-100 shadow-md">
    <div class="container navbar mx-auto">
      <div class="flex-1">
        <RouterLink :to="{ name: 'home' }" class="btn btn-ghost text-xl"
          >Future Commerce</RouterLink
        >
      </div>
      <div class="form-control">
        <input
          @keyup="handleSearch"
          v-model="searchText"
          type="text"
          placeholder="Search"
          class="input input-bordered w-24 md:w-auto"
        />
      </div>
      <div v-if="accountStore.isLoggedIn" class="flex-none">
        <div
          class="dropdown dropdown-end"
          :class="{
            hidden:
              route.name !== 'home' &&
              route.name !== 'checkout-success' &&
              route.name !== 'user-profile' &&
              route.name !== 'purchase-history',
          }"
        >
          <div tabindex="0" role="button" class="btn btn-circle btn-ghost">
            <div class="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="badge indicator-item badge-sm">{{
                userCartStore.totalQuantity
              }}</span>
            </div>
          </div>
          <div
            tabindex="0"
            class="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow"
          >
            <div class="card-body">
              <span class="text-lg font-bold"
                >{{ userCartStore.totalQuantity }} Items</span
              >
              <span class="text-base"
                >Subtotal: {{ userCartStore.totalPrice }}</span
              >
              <div class="card-actions">
                <RouterLink
                  :to="{ name: 'cart' }"
                  class="btn btn-primary btn-block"
                  >View cart</RouterLink
                >
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="avatar btn btn-circle btn-ghost"
          >
            <div class="skeleton w-10 rounded-full">
              <img alt="" :src="accountStore.user.imgUrl" />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <RouterLink
                :to="{ name: 'user-profile' }"
                class="justify-between"
              >
                Profile
                <span class="badge">New</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'purchase-history' }"
                >My Purchase</RouterLink
              >
            </li>
            <li><button @click="signOut()">Logout</button></li>
          </ul>
        </div>
      </div>
      <RouterLink
        v-else
        :to="{ name: 'login' }"
        class="btn ml-4"
        :class="{ hidden: route.name === 'login' || route.name === 'register' }"
        >Sign in</RouterLink
      >
    </div>
  </div>
  <!-- Navbar -->

  <!-- Content -->
  <div class="container mx-auto">
    <slot></slot>
  </div>
  <!-- Content -->

  <!-- Footer -->
  <footer class="mt-10 bg-base-200">
    <div
      class="container footer mx-auto justify-items-center p-10 text-base-content"
    >
      <nav>
        <h6 class="footer-title">Services</h6>
        <a class="link-hover link">Branding</a>
        <a class="link-hover link">Design</a>
        <a class="link-hover link">Marketing</a>
        <a class="link-hover link">Advertisement</a>
      </nav>
      <nav>
        <h6 class="footer-title">Company</h6>
        <a class="link-hover link">About us</a>
        <a class="link-hover link">Contact</a>
        <a class="link-hover link">Jobs</a>
        <a class="link-hover link">Press kit</a>
      </nav>
      <nav>
        <h6 class="footer-title">Legal</h6>
        <a class="link-hover link">Terms of use</a>
        <a class="link-hover link">Privacy policy</a>
        <a class="link-hover link">Cookie policy</a>
      </nav>
    </div>
  </footer>
  <footer class="border-t border-base-300 bg-base-200">
    <div class="container footer mx-auto px-10 py-4 text-base-content">
      <aside class="grid-flow-col items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill-rule="evenodd"
          clip-rule="evenodd"
          class="fill-current"
        >
          <path
            d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
          ></path>
        </svg>
        <p>
          ACME Industries Ltd.
          <br />
          Providing reliable tech since 1992
        </p>
      </aside>
      <nav class="md:place-self-center md:justify-self-end">
        <div class="grid grid-flow-col gap-4">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
              ></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
              ></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
              ></path>
            </svg>
          </a>
        </div>
      </nav>
    </div>
  </footer>
  <!-- Footer -->
</template>
