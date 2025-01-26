<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';

const options = {
  chart: {
    id: 'vuechart-example',
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
};

const series = [
  {
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
];
</script>

<template>
  <AdminLayout>
    <div class="p-14">
      <div class="flex items-center justify-between">
        <div class="text-2xl font-semibold">Admin Dashboard</div>
      </div>
      <div class="divider"></div>
      <div class="overflow-x-auto">
        <div class="mb-6">
          <div class="stats flex border">
            <div class="stat place-items-center">
              <div class="stat-title">Total Revenue</div>
              <div class="stat-value">&#3647;28,000</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title">Total Customers</div>
              <div class="stat-value">1,200</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title">Total Orders</div>
              <div class="stat-value">1,578</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title">Growth</div>
              <div class="stat-value">+12.5%</div>
            </div>
          </div>
        </div>

        <div class="mb-6 rounded-xl border">
          <h3 class="p-6 font-semibold">Sales Overview</h3>
          <apexchart
            height="320"
            type="line"
            :options="options"
            :series="series"
            class="px-6 pb-6"
          ></apexchart>
        </div>

        <div class="mb-6 rounded-xl border">
          <h3 class="p-6 font-semibold">Recent Orders</h3>
          <div class="px-6 pb-6">
            <div class="space-y-4">
              <div
                v-for="i in 5"
                class="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p class="font-medium">John Doe</p>
                  <p class="text-sm text-gray-500">#1234</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">&#3647;28,000</p>
                  <p class="text-sm text-gray-500">Processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border">
          <h3 class="p-6 font-semibold">Low Stock Alert</h3>
          <div class="px-6 pb-6">
            <div class="space-y-4">
              <div
                v-for="i in 3"
                class="flex items-center justify-between rounded-xl border p-4"
              >
                <p class="font-medium">Wireless Earbuds</p>
                <span
                  class="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800"
                  >3 left</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
