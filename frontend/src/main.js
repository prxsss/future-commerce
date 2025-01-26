import './assets/main.css';
import 'vue-toastification/dist/index.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);
app.use(VueApexCharts);

app.mount('#app');
