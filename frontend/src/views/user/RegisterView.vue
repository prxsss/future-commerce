<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import axios from 'axios';

import UserLayout from '@/layouts/UserLayout.vue';

import { useAccountStore } from '@/stores/account';

const router = useRouter();
const accountStore = useAccountStore();

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
});

const signUp = async () => {
  try {
    accountStore.signUp(formData);
    router.push({ name: 'home' });
  } catch (error) {
    console.log(error.response.data);
  }
};

onMounted(() => {
  if (accountStore.isLoggedIn) {
    router.push({ name: 'home' });
  }
});
</script>

<template>
  <UserLayout>
    <div class="grid place-content-center py-20">
      <div class="mb-14 text-center">
        <h1 class="text-6xl font-bold">CREATE ACCOUNT</h1>
        <p>WELCOME TO THE FUTURE COMMERCE</p>
      </div>

      <div class="w-[550px] rounded-2xl bg-base-200 p-12 shadow-md">
        <form @submit.prevent="signUp()" class="mb-4">
          <div class="mb-4 flex items-center gap-2">
            <label
              class="input input-bordered flex flex-auto items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="h-4 w-4 opacity-70"
              >
                <path
                  d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
                />
              </svg>
              <input
                v-model="formData.firstName"
                type="text"
                class="w-full"
                placeholder="First name"
                required
              />
            </label>
            <label class="input input-bordered flex flex-auto items-center">
              <input
                v-model="formData.lastName"
                type="text"
                placeholder="Last name"
                class="w-full"
                required
              />
            </label>
          </div>
          <label class="input input-bordered mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
              />
              <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
              />
            </svg>
            <input
              v-model="formData.email"
              type="email"
              class="grow"
              placeholder="Email"
              required
            />
          </label>
          <label class="input input-bordered mb-8 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              v-model="formData.password"
              type="password"
              class="grow"
              placeholder="Password"
              required
            />
          </label>

          <button class="btn btn-neutral w-full">Sign up</button>
        </form>
        <p class="text-center">
          Already have an account?
          <RouterLink :to="{ name: 'login' }" class="underline"
            >Sign up</RouterLink
          >
        </p>
      </div>
    </div>
  </UserLayout>
</template>
