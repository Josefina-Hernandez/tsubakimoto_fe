import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginAdmin from '../views/admin/LoginAdmin.vue'
import SelectAdmin from '../views/admin/SelectAdmin.vue'
import UsersAdmin from '../views/admin/UsersAdmin.vue'
import AccountManagement from '../views/admin/AcountManagement.vue'
import EditAdmin from '../views/admin/EditAdmin.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/index',
    name: 'index',

    component: () => import('../views/IndexView.vue')
  },
  {
    path: '/selection',
    name: 'selection',

    component: () => import('../views/SelectionView.vue')
  },
  {
    path: '/search',
    name: 'search',

    component: () => import('../views/Search.vue')
  },
  {
    path: '/qtysearch',
    name: 'qtysearch',

    component: () => import('../views/qtySearch.vue')
  },
  {
    path: '/quotationpage',
    name: 'quotationpage',

    component: () => import('../views/QuotationPage.vue')
  },

  {
    path: '/admin/login',
    name: 'loginadmin',

    component: LoginAdmin
  },

  {
    path: '/admin/select',
    name: 'adminselect',

    component: SelectAdmin
  },

  {
    path: '/admin/user',
    name: 'adminuser',

    component: UsersAdmin
  },

  {
    path: '/admin/register-user',
    name: 'adminregister',

    component: () => import('../views/admin/RegisterAdmin.vue')
  },

  {
    path: '/admin/user-management',
    name: 'usermanagement',

    component: AccountManagement
  },

  {
    path: '/admin/edit-user/:userId',
    name: 'edit-user',

    component: EditAdmin
  },

  {
    path: '/admin/quotation-results',
    name: 'quotation-results',

    component: () => import('../views/admin/QuotationResults.vue')
  },

  {
    path: '/admin/price-list',
    name: 'price-list',

    component: () => import('../views/admin/PriceList.vue')
  },

  {
    path: '/admin/distributors-page',
    name: 'distributors-page',

    component: () => import('../views/admin/DistributorsPage.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
