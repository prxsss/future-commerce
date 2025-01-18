<script setup>
import { onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import UserLayout from '@/layouts/UserLayout.vue';

import { useAccountStore } from '@/stores/account';

const accoutStore = useAccountStore();
const route = useRoute();
const router = useRouter();

const routeName = route.name;

onMounted(() => {
  if (!accoutStore.isLoggedIn) {
    router.push({ name: 'login' });
  }
});
</script>

<template>
  <UserLayout>
    <!-- <section class="mt-[4.5625rem]"> -->
    <section>
      <div class="py-4">
        <div class="container mx-auto">
          <div class="flex justify-between">
            <!-- left side -->
            <div class="flex w-1/6 flex-auto flex-col justify-start gap-4">
              <div>
                <div class="flex w-full items-center gap-4">
                  <!-- <img
                    :src="accoutStore.user.imgUrlLarge"
                    alt=""
                    class="h-[50px] w-[50px] rounded-full"
                  /> -->
                  <img
                    :src="accoutStore.user.imgUrl"
                    alt=""
                    class="skeleton h-[50px] w-[50px] rounded-full"
                  />
                  <div>
                    <span class="font-semibold">{{
                      accoutStore.getFullName
                    }}</span>
                    <RouterLink
                      :to="{ name: 'user-profile' }"
                      class="flex items-center gap-1 text-[14px] font-normal text-[#888]"
                    >
                      <!-- <PenIcon class="h-[12px] w-[12px] fill-[#888]" /> -->
                      <i class="pi pi-pencil"></i>
                      Edit Profile
                    </RouterLink>
                  </div>
                </div>
              </div>
              <div>
                <ul class="menu w-56 rounded-box text-base">
                  <li>
                    <RouterLink
                      :to="{ name: 'user-profile' }"
                      class="flex items-center"
                      :class="{ underline: routeName === 'user-profile' }"
                    >
                      <!-- <UserIcon class="h-[12px] w-[12px]" /> -->
                      <i class="pi pi-user"></i>
                      My Account
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink
                      :to="{ name: 'purchase-history' }"
                      class="flex items-center"
                      :class="{
                        underline: routeName === 'purchase-history',
                      }"
                    >
                      <!-- <ReceiptIcon class="h-[12px] w-[12px]" /> -->
                      <i class="pi pi-receipt"></i>
                      My Purchase
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
            <!-- left side -->

            <!-- right side -->
            <!-- <div class="w-5/6 flex-auto border border-blue-400 shadow-lg"> -->
            <div class="ml-[1.875rem] w-5/6 flex-auto">
              <!-- content goes here -->
              <slot></slot>
              <!-- content goes here -->
            </div>
            <!-- right side -->
          </div>
        </div>
      </div>
    </section>
  </UserLayout>
</template>
