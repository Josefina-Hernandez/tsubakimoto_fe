//require('dotenv').config({ path: './.env' });

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/reset.css'

import clickOutside from './plugins/click-outside'

window.store = store  // Expose the store on the window object so it can be accessed in new windows

createApp(App).use(store).use(router).use(clickOutside).mount('#app')
