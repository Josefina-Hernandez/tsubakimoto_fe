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
    path: '/onlinepricelist',
    name: 'OnlinePriceList',

    component: () => import('../views/OnlinePriceList.vue')
  },

  {
    path: '/chaincutting',
    name: 'ChainCutting',

    component: () => import('../views/chainCutting.vue')
  },

  {
    path: '/presubmitquotation',
    name: 'PreSubmitQuotation',

    component: () => import('../views/preSubmitQuotation.vue')
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
    path: '/editquotationpage',
    name: 'EditeQuotationPage',

    component: () => import('../views/EditQuotationPage.vue')
  },

  {
    path: '/editproducts',
    name: 'EditeProducts',

    component: () => import('../views/EditProducts.vue')
  },

  {
    path: '/editproducts-result',
    name: 'EditeProductsForResult',

    component: () => import('../views/EditProductsForResult.vue')
  },

  {
    path: '/exchange',
    name: 'monthlyexchange',

    component: () => import('../views/MonthlyExchange.vue')
  },

  {
    path: '/formation-chain',
    name: 'formationchain',

    component: () => import('../views/FormationChain.vue')
  },

  {
    path: '/packing-chain',
    name: 'packingchain',

    component: () => import('../views/PackingChain.vue')
  },

  {
    path: '/news-page',
    name: 'newspage',

    component: () => import('../views/NewsPage.vue')
  },

  {
    path: '/news-detail/:id',
    name: 'newsdetail',

    component: () => import('../views/NewsDetail.vue')
  },

  {
    path: '/how-to-order',
    name: 'howtoorder',

    component: () => import('../views/HowToOrder.vue')
  },

  {
    path: '/contact-us',
    name: 'contactus',

    component: () => import('../views/ContactUs.vue')
  },

  {
    path: '/quotation-result',
    name: 'quotationresult',

    component: () => import('../views/QuotationResult.vue')
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

  {
    path: '/admin/history',
    name: 'history',

    component: () => import('../views/admin/FileHistory.vue')
  },

  {
    path: '/admin/code-updating',
    name: 'code-updating',

    component: () => import('../views/admin/CodeUpdating.vue')
  },

  {
    path: '/admin/code-adding',
    name: 'code-adding',

    component: () => import('../views/admin/CodeAdding.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
