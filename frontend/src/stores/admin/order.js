import { defineStore } from 'pinia';
import axios from 'axios';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
  }),
  actions: {
    async loadOrder() {
      try {
        const response = await axios.get('/api/orders');
        this.orders = response.data.orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrderById(id) {
      return this.orders.find((order) => order.orderId === id);
    },
  },
});
