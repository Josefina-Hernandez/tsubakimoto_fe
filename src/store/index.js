import { createStore } from 'vuex'

export default createStore({
  state: {
    orderSum: 0,
    personName: '',
    companyName: '',
    newCodeShow: '',
    Unit: '',
    Price: 0,
  },

  getters: {
  },

  mutations: {
    PASSQTY(state, qty){
      state.orderSum = qty;
    },

    PASSCOMPANY(state, company_name){
      state.companyName = company_name;
    },

    PASSPERSON(state, person_name){
      state.personName = person_name;
    },

    PASSCODE(state, new_code_show){
      state.newCodeShow = new_code_show;
    },

    PASSUNIT(state, unit){
      state.Unit = unit;
    },

    PASSPRICE(state, price){
      state.Price = price;
    },
  },

  actions: {
    passOrderQty(context, value){
      context.commit('PASSQTY', value);
    },
    passCompanyName(context, value){
      context.commit('PASSCOMPANY', value);
    },
    passPersonName(context, value){
      context.commit('PASSPERSON', value);
    },
    passNewCodeShow(context, value){
      context.commit('PASSCODE', value);
    },
    passUnit(context, value){
      context.commit('PASSUNIT', value);
    },
    passPrice(context, value){
      context.commit('PASSPRICE', value);
    },
  },
  modules: {
  }
})
