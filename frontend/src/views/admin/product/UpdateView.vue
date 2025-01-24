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

const tabs = ['basic', 'pricing', 'inventory', 'images'];
const currentTab = ref('');

const productId = ref(-1);
let formData = reactive({});

const fileInput = ref(null);
const imgPreview = ref('');
const selectedImgFile = ref(null);

const productCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Audio' },
  { id: 3, name: 'Gaming' },
  { id: 4, name: 'TV' },
  { id: 5, name: 'Camera' },
  { id: 6, name: 'Drone' },
];

const mode = computed(() => {
  return productId.value !== -1 ? 'Edit' : 'Add';
});

const updateTab = (tab) => {
  currentTab.value = tab;
  router.push({ query: { tab } });
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileSelected = (event) => {
  const file = event.target.files[0];

  if (file) {
    selectedImgFile.value = file;
    imgPreview.value = URL.createObjectURL(file);
  }
};

const deleteProduct = async () => {
  try {
    if (confirm('Are you sure you want to delete this product?')) {
      await productStore.deleteProduct(productId.value);
      await productStore.loadProducts();
    }
  } catch (error) {
    console.log(error.response.data);
  }
};

const handleRemoveImage = () => {
  if (confirm('Are you sure you want to remove this image?')) {
    selectedImgFile.value = null;
    imgPreview.value = '';
  }
};

const handleSubmit = async () => {
  if (
    !formData.name ||
    !formData.description ||
    !formData.categoryId ||
    !formData.regularPrice ||
    !formData.salePrice ||
    !formData.currentStock ||
    !formData.minimumStockLevel ||
    !formData.maximumStockLevel ||
    imgPreview.value === ''
  ) {
    alert('Please ensure all fields are filled.');
    return;
  }

  const submitData = new FormData();

  for (const key in formData) {
    submitData.append(key, formData[key]);
  }

  submitData.append('image', selectedImgFile.value);

  console.log(submitData);

  try {
    if (mode.value === 'Add') {
      await productStore.addProduct(submitData);
    } else {
      await productStore.updateProduct(productId.value, submitData);
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

    imgPreview.value = formData.imgUrlLarge;
  }

  currentTab.value = route.query.tab;
});
</script>

<template>
  <AdminLayout>
    <form @submit.prevent="handleSubmit" class="flex h-full flex-col p-14">
      <div>
        <div class="flex items-center justify-between">
          <div class="text-2xl font-semibold">{{ mode }} Product</div>
          <div class="flex gap-4">
            <button
              v-if="mode === 'Edit'"
              @click="deleteProduct"
              class="btn flex items-center px-6 text-base"
              type="button"
            >
              <i
                class="pi pi-trash text-error"
                style="font-size: 1.25rem; font-weight: bold"
              ></i>
              Delete
            </button>
            <button type="submit" class="btn btn-primary px-6 text-base">
              <i
                class="pi pi-save"
                style="font-size: 1rem; font-weight: bold"
              ></i>
              Save Changes
            </button>
          </div>
        </div>
        <div class="mb-8 mt-4 flex items-center justify-start">
          <div role="tablist" class="tabs tabs-bordered">
            <button
              @click="updateTab(tab)"
              v-for="(tab, index) in tabs"
              :key="index"
              type="button"
              role="tab"
              :class="{
                tab: true,
                capitalize: true,
                'tab-active': currentTab === tab,
              }"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <!-- <div class="divider"></div> -->
      </div>

      <!-- Tab 1: Basic -->
      <div v-if="currentTab === 'basic'" class="rounded-xl border p-6">
        <h3 class="mb-4 font-semibold">Basic Infomation</h3>
        <div class="mb-4">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Product Name</span>
            </div>
            <input
              v-model="formData.name"
              type="text"
              placeholder=""
              class="input input-bordered w-full"
              required
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Description</span>
            </div>
            <textarea
              v-model="formData.description"
              class="textarea textarea-bordered h-24"
              placeholder=""
              required
            ></textarea>
          </label>
        </div>

        <div>
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Category</span>
            </div>
            <select
              v-model="formData.categoryId"
              class="select select-bordered"
              required
            >
              <option
                v-for="category in productCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </label>
        </div>
      </div>
      <!-- Tab 1: Basic -->

      <!-- Tab 2: Pricing -->
      <div v-if="currentTab === 'pricing'" class="rounded-xl border p-6">
        <h3 class="mb-4 font-semibold">Pricing Infomation</h3>
        <div class="flex items-center gap-8">
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Regular Price (&#3647;)</span>
            </div>
            <input
              v-model="formData.regularPrice"
              type="number"
              placeholder=""
              class="input input-bordered w-full"
              required
            />
          </label>
          <label class="form-control w-full flex-auto">
            <div class="label">
              <span class="label-text">Sale Price (&#3647;)</span>
            </div>
            <input
              v-model="formData.salePrice"
              type="number"
              placeholder=""
              class="input input-bordered w-full"
              required
            />
          </label>
        </div>
      </div>
      <!-- Tab 2: Pricing -->

      <!-- Tab 3: Inventory -->
      <div v-if="currentTab === 'inventory'" class="rounded-xl border p-6">
        <h3 class="mb-4 font-semibold">Stock Management</h3>
        <div class="mb-4">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Current Stock</span>
            </div>
            <input
              v-model="formData.currentStock"
              type="number"
              placeholder=""
              class="input input-bordered w-full"
              required
            />
          </label>
        </div>
        <div class="flex items-center gap-8">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Minimum Stock Level</span>
            </div>
            <input
              v-model="formData.minimumStockLevel"
              type="number"
              placeholder=""
              class="input input-bordered w-full"
              required
            />
          </label>
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Maximum Stock Level</span>
            </div>
            <input
              v-model="formData.maximumStockLevel"
              type="number"
              placeholder=""
              class="input input-bordered w-full"
              required
            />
          </label>
        </div>
      </div>
      <!-- Tab 3: Inventory -->

      <!-- Tab 4: Images -->
      <div v-if="currentTab === 'images'" class="rounded-xl border p-6">
        <h3 class="mb-4 font-semibold">Product Images</h3>
        <div class="mb-8">
          <h4 class="mb-4 font-semibold">Product Card Image</h4>
          <input
            @change="onFileSelected($event)"
            ref="fileInput"
            type="file"
            class="hidden"
          />
          <button
            v-if="imgPreview == ''"
            @click="triggerFileInput()"
            class="flex aspect-[1792/1024] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
            type="button"
          >
            <i class="pi pi-image mb-4 text-3xl"></i>
            <span class="mb-1">Upload Product Card Image</span>
            <span class="text-sm font-light">1792 &times; 1024px</span>
          </button>
          <div v-else class="group relative">
            <img
              :src="imgPreview"
              alt=""
              class="aspect-[1792/1024] w-full rounded-lg object-cover"
            />
            <button
              @click="handleRemoveImage"
              class="btn btn-circle btn-error absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
              type="button"
            >
              <i class="pi pi-trash text-base-100"></i>
            </button>
          </div>
        </div>
        <!-- <div>
          <h4 class="mb-4 font-semibold">Shopping Cart Thumbnail</h4>
          <input
            @change="onSmallImageFileSelected($event)"
            ref="fileInputForSmallImage"
            type="file"
            class="hidden"
          />
          <button
            v-if="smallImagePreview == ''"
            @click="triggerFileInputForSmallImage"
            :class="[
              'flex aspect-[320/320] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300',
            ]"
            type="button"
          >
            <i class="pi pi-image mb-4 text-3xl"></i>
            <span class="mb-1">Upload Shopping Cart Thumbnail</span>
            <span class="text-sm font-light">320 &times; 320px</span>
          </button>
          <div v-else class="group relative">
            <img
              :src="smallImagePreview"
              alt=""
              class="aspect-[320/320] w-full rounded-lg object-cover"
            />
            <button
              @click="smallImagePreview = ''"
              class="btn btn-circle btn-error absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
              type="button"
            >
              <i class="pi pi-trash text-base-100"></i>
            </button>
          </div>
        </div> -->
      </div>

      <!-- Tab 4: Images -->
    </form>
  </AdminLayout>
</template>
