<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const activeRoute = ref('');

const pageData = [
  {
    name: 'Dashboard',
    routeName: 'admin-dashboard',
  },
  {
    name: 'Product',
    routeName: 'admin-products-list',
  },
  {
    name: 'Order',
    routeName: 'admin-orders-list',
  },
  {
    name: 'User',
    routeName: 'admin-users-list',
  },
  {
    name: 'Sign out',
    routeName: 'admin-signout',
  },
];

onMounted(() => {
  activeRoute.value = route.name;
});
</script>

<template>
  <div class="drawer drawer-open">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content mx-4">
      <!-- Page content here -->
      <!-- <label for="my-drawer" class="btn btn-primary drawer-button"
        >Open drawer</label
      > -->
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
        <!-- Sidebar content here -->
        <li class="mb-4 text-4xl font-bold"><div>Admin</div></li>
        <li v-for="page in pageData" class="text-lg">
          <RouterLink
            :to="{ name: page.routeName }"
            :class="{ active: route.name === page.routeName }"
            >{{ page.name }}</RouterLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>
