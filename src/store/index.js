import { createStore } from 'vuex';
import { getSafeItem, setSafeItem } from '@/utils/storage';

export default createStore({
  state: {
    orderSum: 0,
    personName: '',
    //companyName: '',
    newCodeShow: '',
    Unit: '',
    Price: 0,

    loginMode: localStorage.getItem('loginMode') || null,
    companyName: localStorage.getItem('fullCompanyName') || null,
    companyAddress: localStorage.getItem('companyAddress') || null,
    paymentTerms: localStorage.getItem('paymentTerms') || null,

    //partList: JSON.parse(localStorage.getItem('partList') || '[]'),
    partList: getSafeItem('partList', []),
    endUserName: localStorage.getItem('endUserName') || '',
    yourName: localStorage.getItem('yourName') || '',
    remark: localStorage.getItem('remark') || '',

    previousPage: localStorage.getItem('previousPage') || '',

    userId: localStorage.getItem('userId') || '',
    userName: localStorage.getItem('userName') || '',
    token: localStorage.getItem('token') || null,

    //itemsTargetQuotNo: JSON.parse(localStorage.getItem('itemsTargetQuotNo') || '[]'),
    itemsTargetQuotNo: getSafeItem('itemsTargetQuotNo', []),
    //itemsOrgQuotNo: JSON.parse(localStorage.getItem('itemsOrgQuotNo') || '[]'),
    itemsOrgQuotNo: getSafeItem('itemsOrgQuotNo', []),

    bottomEditBtnText: localStorage.getItem('bottomEditBtnText') || 'Edit',

    MODE: localStorage.getItem('MODE') || 0,

    refDataLine: JSON.parse(localStorage.getItem('refDataLine') || '{}'),

    selectedViewType: localStorage.getItem('selectedViewType') || 'product',
  },

  getters: {
    getLoginMode(state) {
      return state.loginMode;
    },

    getPartList(state) {
      return state.partList;
    },

    getEndUserName(state) {
      return state.endUserName;
    },

    getYourName(state) {
      return state.yourName;
    },

    getRemark(state) {
      return state.remark;
    },

    getUserName(state) {
      return state.userName;
    },

    getUserId(state) {
      return state.userId;
    },

    getItemsTargetQuotNo(state) {
      return state.itemsTargetQuotNo;
    },
    getItemsOrgQuotNo(state) {
      return state.itemsOrgQuotNo;
    },

    getBottomEditBtnText(state) {
      return state.bottomEditBtnText;
    },

    getMODE(state) {
      return state.MODE;
    },

    getRefDataLine(state) {
      return state.refDataLine;
    },

    getSelectedViewType(state) {
      return state.selectedViewType;
    },

    isAuthenticated: (state) => !!state.token,
  },

  mutations: {
    setLoginMode(state, payload) {
      const { mode, companyName, companyAddress, paymentTerms } = payload;

      state.loginMode = mode;
      localStorage.setItem('loginMode', mode);

      state.companyName = companyName;
      localStorage.setItem('fullCompanyName', companyName);

      state.companyAddress = companyAddress;
      localStorage.setItem('companyAddress', companyAddress);

      state.paymentTerms = paymentTerms;
      localStorage.setItem('paymentTerms', paymentTerms);
    },

    PASSQTY(state, qty) {
      state.orderSum = qty;
    },

    PASSCOMPANY(state, company_name) {
      state.companyName = company_name;
    },

    PASSPERSON(state, person_name) {
      state.personName = person_name;
    },

    PASSCODE(state, new_code_show) {
      state.newCodeShow = new_code_show;
    },

    PASSUNIT(state, unit) {
      state.Unit = unit;
    },

    PASSPRICE(state, price) {
      state.Price = price;
    },

    setPartList(state, list) {
      state.partList = list;
      localStorage.setItem('partList', JSON.stringify(list));
    },

    setEndUserName(state, endUserName) {
      state.endUserName = endUserName;
      localStorage.setItem('endUserName', endUserName);
    },

    setYourName(state, yourName) {
      state.yourName = yourName;
      localStorage.setItem('yourName', yourName);
    },

    setRemark(state, remark) {
      state.remark = remark;
      localStorage.setItem('remark', remark);
    },

    setPreviousPage(state, page) {
      state.previousPage = page;
      localStorage.setItem('previousPage', page);
    },

    setUserName(state, userName) {
      state.userName = userName;
      localStorage.setItem('userName', userName);
    },

    setUserId(state, userId) {
      state.userId = userId;
      localStorage.setItem('userId', userId);
    },

    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },

    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    },

    setItemsTargetQuotNo(state, list) {
      state.itemsTargetQuotNo = list;
      localStorage.setItem('itemsTargetQuotNo', JSON.stringify(list));
    },
    setItemsOrgQuotNo(state, list) {
      state.itemsOrgQuotNo = list;
      localStorage.setItem('itemsOrgQuotNo', JSON.stringify(list));
    },

    setBottomEditBtnText(state, text) {
      state.bottomEditBtnText = text;
      localStorage.setItem('bottomEditBtnText', text);
    },

    setMODE(state, mode) {
      state.MODE = mode;
      localStorage.setItem('MODE', mode);
    },

    setRefDataLine(state, line) {
      state.refDataLine = line;
      localStorage.setItem('refDataLine', JSON.stringify(line));
    },

    setSelectedViewType(state, type) {
      state.selectedViewType = type;
      localStorage.setItem('selectedViewType', type);
    },
  },

  actions: {
    updateLoginMode({ commit }, payload) {
      commit('setLoginMode', payload);
    },

    passOrderQty(context, value) {
      context.commit('PASSQTY', value);
    },
    passCompanyName(context, value) {
      context.commit('PASSCOMPANY', value);
    },
    passPersonName(context, value) {
      context.commit('PASSPERSON', value);
    },
    passNewCodeShow(context, value) {
      context.commit('PASSCODE', value);
    },
    passUnit(context, value) {
      context.commit('PASSUNIT', value);
    },
    passPrice(context, value) {
      context.commit('PASSPRICE', value);
    },

    updateUserName({ commit }, userName) {
      commit('setUserName', userName);
    },

    updateUserId({ commit }, userId) {
      commit('setUserId', userId);
    },

    updateToken({ commit }, token) {
      commit('setToken', token);
    },

    logout({ commit }) {
      commit('clearToken');
    }
  },
  modules: {
  }
})
