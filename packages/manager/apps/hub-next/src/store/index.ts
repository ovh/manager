import {
  BillingService,
  Bills,
  Catalog,
  Debt,
  HubResponse,
  HubResponseData,
  LastOrder,
  OvhNotification,
  Services,
  SupportDemand,
  SupportLevel,
  User,
} from '@/models/hub.d';
import { createStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import axios, { AxiosError, AxiosResponse } from 'axios';

export default createStore({
  state: {
    status: false as boolean,
    bills: {} as Bills,
    billingServices: {} as BillingService[],
    catalog: [] as Catalog[],
    certificates: [] as string[],
    debt: {} as Debt,
    lastOrder: {} as LastOrder,
    user: {} as User,
    notifications: {} as OvhNotification,
    paymentMethods: [] as string[],
    services: {} as Services,
    support: {} as SupportDemand,
    supportLevel: {} as SupportLevel,
  },
  getters: {
    getHubStatus: (state) => state.status,
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
    setStatus(state, payload: boolean) {
      state.status = payload;
    },
    setBills(state, payload: Bills) {
      state.bills = payload;
    },
    setBillingServices(state, payload: BillingService[]) {
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
    setNotifications(state, payload: OvhNotification) {
      state.notifications = payload;
    },
    setPaymentMethods(state, payload: string[]) {
      state.paymentMethods = payload;
    },
    setServices(state, payload: Services) {
      state.services = payload;
    },
    setSupport(state, payload: SupportDemand) {
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

      // If we're up to this point, it means data loading has succeeded somewhere else before
      commit('setStatus', true);
    },
    async fetchHubData({ dispatch }) {
      if (this.getters.getHubStatus) {
        return Promise.resolve();
      }

      const { locale } = useI18n();

      const config = {
        data: { serviceType: 'aapi' },
        headers: {
          'Content-Language': locale.value,
        },
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
