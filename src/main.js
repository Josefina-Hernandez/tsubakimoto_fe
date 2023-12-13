//require('dotenv').config({ path: './.env' });

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' 

import './assets/css/reset.css'

window.store = store  // Expose the store on the window object so it can be accessed in new windows

createApp(App).use(store).use(router).mount('#app')
