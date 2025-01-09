import { defineStore } from 'pinia';
import axios from 'axios';

export const useAccountStore = defineStore('account', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: {},
  }),
  getters: {
    getFullName(state) {
      return `${state.user.firstName} ${state.user.lastName}`;
    },
  },
  actions: {
    async checkAuth() {
      try {
        const response = await axios.get('/api/auth/verify-token', {
          withCredentials: true,
        });
        console.log('response:', response.data);

        this.user = response.data.user;
        this.isLoggedIn = true;
        this.isAdmin = response.data.user.isAdmin;
      } catch (error) {
        console.log('error', error);
      }
    },
    async signUp(formData) {
      try {
        const response = await axios.post(`/api/auth/signup`, formData, {
          withCredentials: true,
        });

        console.log(response.data);

        this.isLoggedIn = true;
        this.isAdmin = response.data.user.isAdmin;
        this.user = response.data.user;
      } catch (error) {
        console.log('Error in account.js at signUp', error.response.data);
        throw new Error(error.response.data.msg);
      }
    },
    async signIn(formData) {
      try {
        const response = await axios.post('/api/auth/signin', formData, {
          withCredentials: true,
        });

        console.log(response.data);

        this.isLoggedIn = true;
        this.isAdmin = response.data.user.isAdmin;
        this.user = response.data.user;
      } catch (error) {
        console.log('Error in account.js at signIn', error.response.data);
        throw new Error(error.response.data.msg);
      }
    },
    async signOut() {
      try {
        const response = await axios.get('/api/auth/signout', {
          withCredentials: true,
        });
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.user = {};

        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async updateUser(formData) {
      try {
        console.log('before update:', formData);
        const response = await axios.patch(
          `/api/users/${this.user.id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log(response.data.user);
        this.user = response.data.user;
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
});
