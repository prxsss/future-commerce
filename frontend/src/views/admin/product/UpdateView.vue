<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import AdminLayout from '@/layouts/AdminLayout.vue';

import { useProductStore } from '@/stores/admin/product';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const productStore = useProductStore();

const productId = ref(-1);
let formData = reactive({});

const mode = computed(() => {
  return productId.value !== -1 ? 'Edit' : 'Add';
});

const handleSubmit = async () => {
  // console.log(formData);
  try {
    if (mode.value === 'Add') {
      await productStore.addProduct(formData);
    } else {
      await productStore.updateProduct(productId.value, formData);
    }
    await productStore.loadProducts();
    toast.success('Product ' + mode.value + 'ed Successfully.');
    router.push({ name: 'admin-products-list' });
  } catch (error) {
    console.log(error.response.data);
  }
};

onMounted(() => {
  if (route.params.id) {
    productId.value = parseInt(route.params.id);
    formData = productStore.getProductById(productId.value);
  }
});
</script>

<template>
  <AdminLayout>
    <div class="flex h-full flex-col p-14">
      <div>
        <div class="text-2xl font-semibold">{{ mode }} Product</div>
        <div class="divider"></div>
      </div>
      <div>
        <div class="mb-8 flex items-center gap-8">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Name</span>
            </div>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label>
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Image (url)</span>
            </div>
            <input
              v-model="formData.imgUrlLarge"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label>
        </div>
        <div class="mb-8 flex items-center gap-8">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Price</span>
            </div>
            <input
              v-model="formData.price"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label>
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Quantity</span>
            </div>
            <input
              v-model="formData.quantity"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label>
        </div>
        <div class="mb-8 flex items-center gap-8">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Category ID</span>
            </div>
            <input
              v-model="formData.categoryId"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
          </label>
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Description</span>
            </div>
            <textarea
              v-model="formData.description"
              class="textarea textarea-bordered h-24"
              placeholder="Bio"
            ></textarea>
          </label>
        </div>
      </div>
      <div class="flex flex-auto items-end justify-end gap-4">
        <RouterLink :to="{ name: 'admin-products-list' }" class="btn px-6"
          >Back</RouterLink
        >
        <button @click="handleSubmit()" class="btn btn-primary px-6">
          {{ mode }}
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
