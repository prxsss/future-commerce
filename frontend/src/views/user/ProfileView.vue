<script setup>
import { ref, reactive } from 'vue';

import UserDashboardLayout from '@/layouts/UserDashboardLayout.vue';

import { useAccountStore } from '@/stores/account';

const accountStore = useAccountStore();

const fileInput = ref(null);
const imagePreview = ref(accountStore.user.imgUrl);
const selectedFile = ref(null);

const handleClick = () => {
  alert('This feature is under development. Please try again later.');
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const validateFile = (file) => {
  const maxFileSize = 1 * 1024 * 1024; // 1MB
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (file.size > maxFileSize) {
    alert('Please select an image file less than 1 MB.');
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    alert('Please select a JPEG or PNG image file.');
    return false;
  }

  return true;
};

const onFileSelected = (event) => {
  const file = event.target.files[0];

  if (file && validateFile(file)) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSave = async (event) => {
  try {
    const formData = new FormData();
    formData.append('firstName', event.target.firstName.value);
    formData.append('lastName', event.target.lastName.value);
    formData.append('email', event.target.email.value);

    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    await accountStore.updateUser(formData);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <UserDashboardLayout>
    <section
      class="h-ful w-full rounded-sm bg-base-100 shadow-lg dark:border dark:border-white"
    >
      <div class="px-[1.875rem] pb-8">
        <!-- Header -->
        <div class="pb-3 pt-[1.125rem]">
          <h1 class="text-lg font-[500]">My Profile</h1>
          <div class="mt-[0.1875rem] text-sm">
            Manage and protect your account
          </div>
        </div>
        <!-- Header -->
        <div class="divider my-0"></div>

        <!-- Content -->
        <div class="flex items-start pt-[1.875rem]">
          <!-- Left side -->
          <div class="w-[70%] flex-auto pr-[3.125rem]">
            <form @submit.prevent="handleSave($event)">
              <table class="table">
                <tbody
                  class="[&>tr>td:first-child]:w-[25%] [&>tr>td:first-child]:text-right [&>tr]:border-b-0"
                >
                  <!-- row 1 -->
                  <!-- <tr>
                    <td>Username</td>
                    <td>
                      <div>
                        <label for="username">
                          <input
                            v-model="accountStore.user.userName"
                            name="username"
                            type="text"
                            placeholder=""
                            class="input input-bordered w-full"
                            disabled
                          />
                        </label>
                      </div>
                    </td>
                  </tr> -->
                  <!-- row 2 -->
                  <tr>
                    <td>First Name</td>
                    <td>
                      <div>
                        <label for="firstName">
                          <input
                            name="firstName"
                            type="text"
                            placeholder=""
                            :value="accountStore.user.firstName"
                            class="input input-bordered w-full"
                          />
                        </label>
                      </div>
                    </td>
                  </tr>
                  <!-- row 3 -->
                  <tr>
                    <td>Last Name</td>
                    <td>
                      <div>
                        <label for="lastName">
                          <input
                            name="lastName"
                            type="text"
                            placeholder=""
                            :value="accountStore.user.lastName"
                            class="input input-bordered w-full"
                          />
                        </label>
                      </div>
                    </td>
                  </tr>
                  <!-- row 4 -->
                  <tr>
                    <td>Email</td>
                    <td>
                      <div>
                        <label for="email">
                          <input
                            name="email"
                            type="email"
                            placeholder=""
                            :value="accountStore.user.email"
                            class="input input-bordered w-full"
                            disabled
                          />
                        </label>
                      </div>
                    </td>
                    <!-- <td>
                      <div>
                        <div class="inline">{{ accountStore.user.email }}</div>
                        <button
                          @click="handleClick"
                          class="text-navy-500 px-[0.375rem] py-[0.0625rem] underline"
                        >
                          Change
                        </button>
                      </div>
                    </td> -->
                  </tr>
                  <!-- row 5 -->
                  <!-- <tr>
                    <td>Phone Number</td>
                    <td>
                      <div>
                        <div class="inline">{{ accountStore.user.phone }}</div>
                        <button
                          @click="handleClick"
                          class="text-navy-500 px-[0.375rem] py-[0.0625rem] underline"
                        >
                          Change
                        </button>
                      </div>
                    </td>
                  </tr> -->
                  <!-- row 6 -->
                  <tr>
                    <td><label></label></td>
                    <td>
                      <button type="submit" class="btn btn-primary">
                        Save
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
          <!-- Left side -->

          <!-- Right side -->
          <div
            class="border-[rgb(229, 231, 235)] flex w-[30%] flex-auto justify-center border-l"
          >
            <div class="flex flex-col items-center">
              <div class="my-[1.25rem]">
                <img
                  class="skeleton h-[100px] w-[100px] rounded-full object-cover"
                  :src="imagePreview"
                  alt=""
                />
              </div>
              <input
                @change="onFileSelected($event)"
                type="file"
                class="hidden"
                ref="fileInput"
              />
              <button
                @click="triggerFileInput"
                class="border-navy-500 text-navy-500 h-[40px] rounded border px-5 font-[500] transition-all hover:bg-primary hover:text-white"
              >
                Select Image
              </button>
              <div class="mt-[1rem] text-sm text-[#999]">
                <div>File size: maximum 1 MB</div>
                <div>File extension: .JPEG, .PNG</div>
              </div>
            </div>
          </div>
          <!-- Right side -->
        </div>
        <!-- Content -->
      </div>
    </section>
  </UserDashboardLayout>
</template>
