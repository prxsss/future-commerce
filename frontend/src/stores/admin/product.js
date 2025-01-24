import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('product', {
  state: () => ({
    items: [],
  }),
  actions: {
    async loadProducts() {
      const response = await axios.get('/api/products');

      if (response.data.products.length !== 0) {
        this.items = response.data.products;
      }
    },
    getProductById(id) {
      return this.items.find((item) => item.id === id);
    },
    async addProduct(productData) {
      try {
        const response = await axios.post('/api/products', productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async updateProduct(id, productData) {
      console.log('id', id);
      console.log('product', productData);
      try {
        const response = await axios.patch(`/api/products/${id}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    },
    async deleteProduct(id) {
      try {
        const response = await axios.delete(`/api/products/${id}`);

        console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
});
