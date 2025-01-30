<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';

import { useUserStore } from '@/stores/admin/user';

const userStore = useUserStore();
</script>

<template>
  <AdminLayout>
    <div class="p-14">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-semibold">User Management</div>
      </div>
      <div class="divider"></div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Updated At</th>
              <th>Total Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userStore.users">
              <th>{{ user.firstName }} {{ user.lastName }}</th>
              <td>{{ user.email }}</td>
              <td>{{ user.isAdmin ? 'Admin' : 'User' }}</td>
              <td>
                <span
                  :class="[
                    'badge',
                    {
                      'badge-success': user.status === 'active',
                      'badge-error': user.status === 'inactive',
                    },
                  ]"
                  >{{ user.status }}</span
                >
              </td>
              <td>{{ new Date(user.updatedAt).toLocaleString() }}</td>
              <td>{{ user.totalOrders }}</td>
              <td>
                <RouterLink
                  :to="{ name: 'admin-users-update', params: { id: user.id } }"
                  class="text-primary"
                >
                  <i class="pi pi-pen-to-square" style="font-size: 1.25rem"></i>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
