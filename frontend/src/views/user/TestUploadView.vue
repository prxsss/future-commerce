<script setup>
import { ref } from 'vue';
import axios from 'axios';

const imagePreview = ref('https://placehold.co/100x100.png');
const selectedFile = ref(null);

const onFileSelected = (event) => {
  const file = event.target.files[0];

  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleUpload = async () => {
  try {
    // const fileUpload = document.getElementById('file-upload');
    // console.log(fileUpload.files[0]);

    if (!selectedFile.value) {
      alert('Please select a file');
      return false;
    }

    const formData = new FormData();
    formData.append('image', selectedFile.value);

    const response = await axios.post('/api/tests/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
  } catch (error) {
    if (error.response) {
      alert(error.response.data.error);
    }
  }
};
</script>

<template>
  <div>
    <div class="mb-8 mt-4">
      <h1 class="text-center text-3xl font-[700]">TestUploadView</h1>
    </div>
    <div class="mb-5 flex justify-center">
      <div class="avatar">
        <div class="mx-auto w-24 rounded-full">
          <img :src="imagePreview" />
        </div>
      </div>
    </div>
    <div class="space-x-4 text-center">
      <input
        @change="onFileSelected($event)"
        id="file-upload"
        type="file"
        class="file-input file-input-bordered file-input-primary w-full max-w-xs"
      />
      <button @click="handleUpload" class="btn btn-primary">Upload</button>
    </div>
  </div>
</template>
