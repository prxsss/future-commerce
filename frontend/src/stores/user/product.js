import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserProductStore = defineStore('user-product', {
  state: () => ({
    products: [
      // {
      //   id: 1,
      //   imgUrlLarge: 'src/assets/img/products/Smartphone X.jpeg',
      //   name: 'Smartphone X',
      //   description: 'สมาร์ทโฟนรุ่นล่าสุดพร้อมจอแสดงผล OLED และกล้อง 4 ตัว',
      //   price: 29900.0,
      //   quantity: 50,
      //   category_id: 1,
      //   createdAt: '2024-09-01',
      //   updatedAt: '2024-09-10',
      // },
      // {
      //   id: 2,
      //   imgUrlLarge: 'src/assets/img/products/Wireless Earbuds Pro.jpeg',
      //   name: 'Wireless Earbuds Pro',
      //   description:
      //     'หูฟังไร้สายคุณภาพเสียงระดับพรีเมียม พร้อมระบบตัดเสียงรบกวน',
      //   price: 4990.0,
      //   quantity: 120,
      //   category_id: 2,
      //   createdAt: '2024-09-05',
      //   updatedAt: '2024-09-15',
      // },
      // {
      //   id: 3,
      //   imgUrlLarge: 'src/assets/img/products/Gaming Laptop Z15.jpeg',
      //   name: 'Gaming Laptop Z15',
      //   description:
      //     'โน้ตบุ๊คสำหรับเล่นเกมที่มาพร้อมกับการ์ดจอ RTX 3080 และจอแสดงผล 144Hz',
      //   price: 75900.0,
      //   quantity: 25,
      //   category_id: 3,
      //   createdAt: '2024-09-03',
      //   updatedAt: '2024-09-12',
      // },
      // {
      //   id: 4,
      //   imgUrlLarge: 'src/assets/img/products/4K Ultra HD TV.jpeg',
      //   name: '4K Ultra HD TV',
      //   description:
      //     'ทีวีจอ 55 นิ้ว ความละเอียด 4K Ultra HD พร้อมระบบ Smart TV',
      //   price: 22990.0,
      //   quantity: 30,
      //   category_id: 4,
      //   createdAt: '2024-09-02',
      //   updatedAt: '2024-09-11',
      // },
      // {
      //   id: 5,
      //   imgUrlLarge: 'src/assets/img/products/Bluetooth Speaker.jpeg',
      //   name: 'Bluetooth Speaker',
      //   description: 'ลำโพงบลูทูธพกพา คุณภาพเสียงเยี่ยม รองรับการเชื่อมต่อ NFC',
      //   price: 2990.0,
      //   quantity: 150,
      //   category_id: 2,
      //   createdAt: '2024-09-08',
      //   updatedAt: '2024-09-18',
      // },
      // {
      //   id: 6,
      //   imgUrlLarge: 'src/assets/img/products/Smart Watch Series 7.jpeg',
      //   name: 'Smart Watch Series 7',
      //   description:
      //     'นาฬิกาอัจฉริยะพร้อมฟังก์ชันวัดชีพจรและตรวจสอบการออกกำลังกาย',
      //   price: 13900.0,
      //   quantity: 75,
      //   category_id: 1,
      //   createdAt: '2024-09-07',
      //   updatedAt: '2024-09-14',
      // },
      // {
      //   id: 7,
      //   imgUrlLarge: 'src/assets/img/products/Digital Camera Pro.jpeg',
      //   name: 'Digital Camera Pro',
      //   description:
      //     'กล้องถ่ายรูปดิจิทัลความละเอียดสูง 24MP พร้อมเลนส์ 18-55mm',
      //   price: 18900.0,
      //   quantity: 40,
      //   category_id: 5,
      //   createdAt: '2024-09-09',
      //   updatedAt: '2024-09-17',
      // },
      // {
      //   id: 8,
      //   imgUrlLarge: 'src/assets/img/products/Mechanical Keyboard.jpeg',
      //   name: 'Mechanical Keyboard',
      //   description:
      //     'คีย์บอร์ดแมคคานิคัลพร้อมไฟ RGB และปุ่มกดที่ออกแบบมาสำหรับเกมเมอร์',
      //   price: 4590.0,
      //   quantity: 100,
      //   category_id: 3,
      //   createdAt: '2024-09-06',
      //   updatedAt: '2024-09-16',
      // },
      // {
      //   id: 9,
      //   imgUrlLarge: 'src/assets/img/products/Drone Quadcopter X.jpeg',
      //   name: 'Drone Quadcopter X',
      //   description: 'โดรนควอดคอปเตอร์พร้อมกล้อง 4K และระบบบินอัตโนมัติ',
      //   price: 25900.0,
      //   quantity: 15,
      //   category_id: 6,
      //   createdAt: '2024-09-04',
      //   updatedAt: '2024-09-13',
      // },
      // {
      //   id: 10,
      //   imgUrlLarge: 'src/assets/img/products/Fitness Tracker.jpeg',
      //   name: 'Fitness Tracker',
      //   description:
      //     'อุปกรณ์ติดตามการออกกำลังกายที่สามารถวัดการเต้นของหัวใจและการนอนหลับ',
      //   price: 3990.0,
      //   quantity: 200,
      //   category_id: 1,
      //   createdAt: '2024-09-11',
      //   updatedAt: '2024-09-20',
      // },
    ],
  }),
  actions: {
    async loadProducts() {
      try {
        const response = await axios.get('/api/products');
        if (response.data.products.length !== 0) {
          this.products = response.data.products;
          console.log('Loaded products:', this.products);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    },
    filterProducts(searchText) {
      console.log('search: ', searchText);

      return this.products.filter((product) => {
        return product.name.toLowerCase().includes(searchText.toLowerCase());
      });
    },
  },
});
