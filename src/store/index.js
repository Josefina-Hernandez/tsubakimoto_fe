import { createStore } from 'vuex'

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

    partList: JSON.parse(localStorage.getItem('partList') || '[]'),
    endUserName: localStorage.getItem('endUserName') || '',
    yourName: localStorage.getItem('yourName') || '',
    remark: localStorage.getItem('remark') || '',
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
  },

  mutations: {
    setLoginMode(state, payload) {
      const { mode, companyName, companyAddress, paymentTerms } = payload;

      state.loginMode = mode;
      localStorage.setItem('loginMode', mode);

      state.companyName = companyName;
      localStorage.setItem('CompanyName', companyName);

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
  },
  modules: {
  }
})
