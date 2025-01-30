<script setup>
import { onMounted, ref, reactive } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import AdminLayout from '@/layouts/AdminLayout.vue';

import { useUserStore } from '@/stores/admin/user';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

const userId = ref(-1);
const userRole = ref('');
let formData = reactive({});

const handleRoleChange = (role) => {
  console.log(role);
  console.log(role === 'Admin' ? true : false);

  formData.isAdmin = role === 'Admin' ? true : false;

  console.log(formData);
};

const handleSubmit = async () => {
  try {
    await userStore.updateUser(userId.value, formData);
    await userStore.loadUsers();
    toast.success(`User ID: ${userId.value} Updated Successfully.`);
    router.push({ name: 'admin-users-list' });
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  console.log('id', route.params.id);
  if (route.params.id) {
    console.log('route.params.id', route.params.id);
    userId.value = parseInt(route.params.id);
    formData = userStore.getUserById(userId.value);

    userRole.value = formData.isAdmin ? 'Admin' : 'User';
  }
});
</script>

<template>
  <AdminLayout>
    <div class="flex h-full flex-col p-14">
      <div>
        <div class="text-2xl font-semibold">Edit User</div>
      </div>
      <div class="mt-6 rounded-xl border">
        <div class="p-6">
          <h3 class="font-semibold leading-none tracking-tight">
            User Information
          </h3>
        </div>
        <div class="px-6 pb-6">
          <div class="space-y-6">
            <div class="flex items-center gap-8">
              <label class="form-control w-full flex-auto">
                <div class="label">
                  <span class="label-text">First name</span>
                </div>
                <input
                  v-model="formData.firstName"
                  type="text"
                  placeholder=""
                  class="input input-bordered w-full"
                />
              </label>
            </div>
            <div class="flex items-center gap-8">
              <label class="form-control w-full flex-auto">
                <div class="label">
                  <span class="label-text">Last name</span>
                </div>
                <input
                  v-model="formData.lastName"
                  type="text"
                  placeholder=""
                  class="input input-bordered w-full"
                />
              </label>
            </div>
            <div class="flex items-center gap-8">
              <label class="form-control w-full flex-auto">
                <div class="label">
                  <span class="label-text">Email</span>
                </div>
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder=""
                  class="input input-bordered w-full"
                  disabled
                />
              </label>
            </div>
            <div class="flex items-center gap-8">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Role</span>
                </div>
                <select
                  v-model="userRole"
                  @change="handleRoleChange($event.target.value)"
                  class="select select-bordered"
                >
                  <option>Admin</option>
                  <option>User</option>
                </select>
              </label>
            </div>
            <div class="flex items-center gap-8">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Status</span>
                </div>
                <select
                  v-model="formData.status"
                  class="select select-bordered"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <div class="flex flex-auto items-end justify-end gap-4 px-6 pb-6">
          <RouterLink :to="{ name: 'admin-users-list' }" class="btn px-6"
            >Back</RouterLink
          >
          <button @click="handleSubmit()" class="btn btn-primary px-6">
            Update
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
