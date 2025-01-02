import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
  }),
  actions: {
    async loadUsers() {
      try {
        const response = await axios.get('/api/users');

        this.users = response.data.users;
        console.log('Loaded users:', this.users);
      } catch (error) {
        console.log(error);
      }
    },
    getUserById(id) {
      return this.users.find((user) => user.id === id);
    },
    async updateUser(id, formData) {
      try {
        console.log('id', id);
        console.log('before update:', formData);
        const response = await axios.patch(`/api/users/${id}`, formData, {
          withCredentials: true,
        });
        console.log(response.data.user);
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
});
