<script setup>
import { ref } from 'vue';

import { useUserCartStore } from '@/stores/user/cart';

const userCartStore = useUserCartStore();

const props = defineProps({
  item: Object,
  index: Number,
});

// const quantity = ref(userCartStore.items[props.index].cartItemQuantity);
const quantity = ref(props.item.cartItemQuantity);

const handleIncrease = () => {
  quantity.value++;
};

const handleDecrease = () => {
  if (quantity.value <= 0) return;

  quantity.value--;
};

const handleUpdate = () => {
  if (typeof quantity.value == 'string') {
    quantity.value = 0;
  }

  if (quantity.value <= 0) {
    userCartStore.removeItemInCart(props.index);
    return;
  }

  userCartStore.updateItemInCart(props.index, quantity.value);
};
</script>

<template>
  <th>
    <div class="flex gap-4">
      <img
        class="h-[100px] w-[100px] object-cover"
        :src="item.imgUrlSmall"
        :alt="item.name"
      />
      <div class="font-normal">
        <div class="text-sm">{{ item.name }}</div>
        <button
          @click="userCartStore.removeItemInCart(props.index)"
          class="text-xs text-gray-400"
        >
          Remove
        </button>
      </div>
    </div>
  </th>
  <td>
    <div class="relative w-fit">
      <div class="join border">
        <button @click="handleDecrease" class="btn join-item">-</button>
        <!-- <input
                          v-model="item.cartItemQuantity"
                          @change="
                            userCartStore.updateItemInCart(
                              index,
                              $event.target.value
                            )
                          "
                          class="input join-item max-w-10"
                          type="number"
                          placeholder=""
                        /> -->
        <input
          v-model="quantity"
          class="input join-item max-w-16 px-1 text-center focus:outline-none"
          type="number"
          placeholder=""
        />
        <button @click="handleIncrease" class="btn join-item">+</button>
      </div>
      <button
        @click="handleUpdate"
        class="link-hover link absolute -bottom-7 left-1/2 -translate-x-1/2"
      >
        Update
      </button>
    </div>
    <!-- <select
                      v-model="item.cartItemQuantity"
                      @change="
                        userCartStore.updateItemInCart(
                          index,
                          $event.target.value
                        )
                      "
                      class="select select-bordered w-full"
                    >
                      <option v-for="quantity in item.productQuantity">
                        {{ quantity }}
                      </option>
                    </select> -->
  </td>
  <td>&#3647;{{ item.price }}</td>
  <td>&#3647;{{ item.cartItemQuantity * item.price }}</td>
</template>
