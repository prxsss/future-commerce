import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserOrderStore } from './order';

import { useAccountStore } from '@/stores/account';

export const useUserCartStore = defineStore('cart', {
  state: () => ({
    items: [
      // {
      //   id: 7,
      //   imgUrlLarge: 'src/assets/img/products/Digital Camera Pro.jpeg',
      //   name: 'Digital Camera Pro',
      //   description:
      //     'กล้องถ่ายรูปดิจิทัลความละเอียดสูง 24MP พร้อมเลนส์ 18-55mm',
      //   price: 18900.0,
      //   quantity: 10,
      //   category_id: 5,
      //   quantity: 1,
      // },
      // {
      //   id: 8,
      //   imgUrlLarge: 'src/assets/img/products/Mechanical Keyboard.jpeg',
      //   name: 'Mechanical Keyboard',
      //   description:
      //     'คีย์บอร์ดแมคคานิคัลพร้อมไฟ RGB และปุ่มกดที่ออกแบบมาสำหรับเกมเมอร์',
      //   price: 4590.0,
      //   quantity: 15,
      //   category_id: 3,
      //   quantity: 2,
      // },
      // {
      //   id: 8,
      //   imgUrlLarge: 'src/assets/img/products/Mechanical Keyboard.jpeg',
      //   name: 'Mechanical Keyboard',
      //   description:
      //     'คีย์บอร์ดแมคคานิคัลพร้อมไฟ RGB และปุ่มกดที่ออกแบบมาสำหรับเกมเมอร์',
      //   price: 4590.0,
      //   quantity: 18,
      //   category_id: 3,
      //   quantity: 2,
      // },
      // {
      //   id: 8,
      //   imgUrlLarge: 'src/assets/img/products/Mechanical Keyboard.jpeg',
      //   name: 'Mechanical Keyboard',
      //   description:
      //     'คีย์บอร์ดแมคคานิคัลพร้อมไฟ RGB และปุ่มกดที่ออกแบบมาสำหรับเกมเมอร์',
      //   price: 4590.0,
      //   quantity: 9,
      //   category_id: 3,
      //   quantity: 2,
      // },
      // {
      //   id: 8,
      //   imgUrlLarge: 'src/assets/img/products/Mechanical Keyboard.jpeg',
      //   name: 'Mechanical Keyboard',
      //   description:
      //     'คีย์บอร์ดแมคคานิคัลพร้อมไฟ RGB และปุ่มกดที่ออกแบบมาสำหรับเกมเมอร์',
      //   price: 4590.0,
      //   quantity: 5,
      //   category_id: 3,
      //   quantity: 2,
      // },
      // {
      //   id: 8,
      //   imgUrlLarge: 'src/assets/img/products/Mechanical Keyboard.jpeg',
      //   name: 'Mechanical Keyboard',
      //   description:
      //     'คีย์บอร์ดแมคคานิคัลพร้อมไฟ RGB และปุ่มกดที่ออกแบบมาสำหรับเกมเมอร์',
      //   price: 4590.0,
      //   quantity: 14,
      //   category_id: 3,
      //   quantity: 2,
      // },
    ],
    checkout: {},
  }),
  getters: {
    totalPrice(state) {
      return state.items.reduce(
        (acc, item) =>
          acc + parseInt(item.price) * parseInt(item.cartItemQuantity),
        0
      );
    },
    totalQuantity(state) {
      return state.items.reduce(
        (acc, item) => acc + parseInt(item.cartItemQuantity),
        0
      );
    },
  },

  actions: {
    async addItemToCart(product) {
      try {
        console.log(product);
        const indexOfAddedItem = this.items.findIndex(
          (item) => item.id === product.id
        );

        if (indexOfAddedItem >= 0) {
          this.updateItemInCart(
            indexOfAddedItem,
            this.items[indexOfAddedItem].quantity + 1
          );
          return -1;
        }

        // this.items.push({
        //   id: product.id,
        //   imgUrlLarge: product.imgUrlLarge,
        //   name: product.name,
        //   description: product.description,
        //   price: product.price,
        //   quantity: product.quantity,
        //   category_id: product.category_id,
        //   quantity: 1,
        // });

        const accountStore = useAccountStore();

        console.log('user id', accountStore.user.id);

        await axios.post(`/api/carts/items`, {
          userId: accountStore.user.id,
          productId: product.id,
          quantity: 1,
          price: product.price,
        });

        const response = await axios.get(`/api/carts/${accountStore.user.id}`);

        this.items = response.data.cartItems;
        console.log('cart items:', response.data);

        console.log('added', this.items);
      } catch (error) {
        console.log(error);
      }
    },
    async updateItemInCart(index, quantity) {
      try {
        const parsedQuantity = parseInt(quantity);

        await axios.patch(`/api/carts/items/${this.items[index].cartItemId}`, {
          quantity: parsedQuantity,
        });

        const accountStore = useAccountStore();

        const response = await axios.get(`/api/carts/${accountStore.user.id}`);

        this.items = response.data.cartItems;
      } catch (error) {
        console.log(error);
      }
      // this.items[index].quantity = parseInt(quantity);

      // console.log(this.items[index]);
    },
    async removeItemInCart(index) {
      try {
        await axios.delete(`/api/carts/items/${this.items[index].cartItemId}`);
        this.items.splice(index, 1);
      } catch (error) {
        console.log(error);
      }
      // console.log(index);
    },
    async checkout(orderData) {
      try {
        const userOrderStore = useUserOrderStore();

        console.log(orderData);
        const response = await axios.post(`/api/carts/checkout`, orderData);
        this.checkout = response.data.order;

        userOrderStore.loadOrders();

        console.log('after checkout:', this.checkout);
      } catch (error) {
        console.log(error);
      }
    },
    async loadCart() {
      try {
        console.log('load cart');

        const accountStore = useAccountStore();

        if (!accountStore.isLoggedIn) {
          console.log('not logged in');
          this.items = [];
          return -1;
        }

        const response = await axios.get(`/api/carts/${accountStore.user.id}`);

        this.items = response.data.cartItems;
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
