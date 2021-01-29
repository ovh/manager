import {
  BillingServices,
  Bills,
  Catalog,
  Debt,
  HubResponse,
  HubResponseData,
  LastOrder,
  Notifications,
  Services,
  Support,
  SupportLevel,
  User,
} from '@/models/hub.d';
import { createStore } from 'vuex';
import axios, { AxiosError, AxiosResponse } from 'axios';

export default createStore({
  state: {
    bills: {} as Bills,
    billingServices: {} as BillingServices,
    catalog: [] as Catalog[],
    certificates: [] as string[],
    debt: {} as Debt,
    lastOrder: {} as LastOrder,
    user: {} as User,
    notifications: {} as Notifications,
    paymentMethods: [] as string[],
    services: {} as Services,
    support: {} as Support,
    supportLevel: {} as SupportLevel,
  },
  getters: {
    getBills: (state) => state.bills,
    getBillingServices: (state) => state.billingServices,
    getCatalog: (state) => state.catalog,
    getCertificates: (state) => state.certificates,
    getDebt: (state) => state.debt,
    getLastOrder: (state) => state.lastOrder,
    getUser: (state) => state.user,
    getNotifications: (state) => state.notifications,
    getPaymentMethods: (state) => state.paymentMethods,
    getServices: (state) => state.services,
    getSupport: (state) => state.support,
    getSupportLevel: (state) => state.supportLevel,
  },
  mutations: {
    setBills(state, payload: Bills) {
      state.bills = payload;
    },
    setBillingServices(state, payload: BillingServices) {
      state.billingServices = payload;
    },
    setCatalog(state, payload: Catalog[]) {
      state.catalog = payload;
    },
    setCertificates(state, payload: string[]) {
      state.certificates = payload;
    },
    setDebt(state, payload: Debt) {
      state.debt = payload;
    },
    setLastOrder(state, payload: LastOrder) {
      state.lastOrder = payload;
    },
    setUser(state, payload: User) {
      state.user = payload;
    },
    setNotifications(state, payload: Notifications) {
      state.notifications = payload;
    },
    setPaymentMethods(state, payload: string[]) {
      state.paymentMethods = payload;
    },
    setServices(state, payload: Services) {
      state.services = payload;
    },
    setSupport(state, payload: Support) {
      state.support = payload;
    },
    setSupportLevel(state, payload: SupportLevel) {
      state.supportLevel = payload;
    },
  },
  actions: {
    initState({ commit }, serverState: HubResponseData) {
      commit('setBills', serverState.bills.data);
      commit('setBillingServices', serverState.billingServices.data);
      commit('setCatalog', serverState.catalog.data);
      commit('setCertificates', serverState.certificates.data);
      commit('setDebt', serverState.debt.data);
      commit('setLastOrder', serverState.lastOrder.data);
      commit('setUser', serverState.me.data);
      commit('setNotifications', serverState.notifications.data);
      commit('setPaymentMethods', serverState.paymentMethods.data);
      commit('setServices', serverState.services.data);
      commit('setSupport', serverState.support.data);
      commit('setSupportLevel', serverState.supportLevel.data);
    },
    async fetchHubData({ dispatch }) {
      const config = {
        data: { serviceType: 'aapi' },
      };
      return axios
        .get<HubResponse>('/engine/2api/hub', config)
        .then((data: AxiosResponse<HubResponse>) => dispatch('initState', data.data.data))
        .catch((error: AxiosError) => {
          console.error(error.message);
        });
    },
  },
  modules: {},
});
