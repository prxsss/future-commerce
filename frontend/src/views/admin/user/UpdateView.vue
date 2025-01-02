<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
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
  // console.log(formData);
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
        <div class="text-2xl font-semibold">Update User ID: {{ userId }}</div>
        <div class="divider"></div>
      </div>
      <div>
        <div class="mb-8 flex items-center gap-8">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">First name</span>
            </div>
            <input
              v-model="formData.firstName"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label>
          <!-- <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Image (url)</span>
            </div>
            <input
              v-model="formData.imgUrlLarge"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label> -->
        </div>
        <div class="mb-8 flex items-center gap-8">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Last name</span>
            </div>
            <input
              v-model="formData.lastName"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label>
          <!-- <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Quantity</span>
            </div>
            <input
              v-model="formData.quantity"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label> -->
        </div>
        <div class="mb-8 flex items-center gap-8">
          <!-- <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Role</span>
            </div>
            <input
              v-model="formData.isAdmin"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label> -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Role</span>
            </div>
            <select
              v-model="userRole"
              @change="handleRoleChange($event.target.value)"
              class="select select-bordered"
            >
              <!-- <option disabled selected>Pick one</option> -->
              <option>Admin</option>
              <option>User</option>
            </select>
          </label>
          <!-- <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Description</span>
            </div>
            <textarea
              v-model="formData.description"
              class="textarea textarea-bordered h-24"
              placeholder="Bio"
            ></textarea>
          </label> -->
        </div>
      </div>
      <div class="flex flex-auto items-end justify-end gap-4">
        <RouterLink :to="{ name: 'admin-users-list' }" class="btn px-6"
          >Back</RouterLink
        >
        <button @click="handleSubmit()" class="btn btn-primary px-6">
          Update
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
