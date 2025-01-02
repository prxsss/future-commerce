import { defineStore } from 'pinia';
import axios from 'axios';
import { useAccountStore } from '../account';

export const useUserOrderStore = defineStore('user-order', {
  state: () => ({
    orders: [],
  }),
  actions: {
    async loadOrders() {
      try {
        console.log('loading orders');

        const accountStore = useAccountStore();

        const response = await axios.get(
          `/api/orders/user/${accountStore.user.id}`
        );

        console.log(response.data.orders);

        this.orders = response.data.orders;
      } catch (error) {
        console.log('error loading orders', error);
      }
    },
    async getOrderById(id) {
      try {
        console.log('id', id);

        const response = await axios.get(`/api/orders/${id}`);

        console.log('get order by id:', response.data);

        return response.data.order;

        // this.orders.push(response.data);
        // console.log(this.orders);
      } catch (error) {
        console.log(error);
      }
    },
    filterOrders(searchText) {
      return this.orders.filter((order) => {
        return order.orderId
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    },
  },
});
