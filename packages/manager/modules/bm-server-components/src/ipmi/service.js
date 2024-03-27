import { KVM_PLAN_CODE } from './constants';

export default class BmServerComponentsIpmiService {
  /* @ngInject */
  constructor($http, $q, coreConfig) {
    this.$http = $http;
    this.$q = $q;
    this.user = coreConfig.getUser();
  }

  getKvmFeatures(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/features/kvm`)
      .then(({ data }) => data);
  }

  getIpmiFeatures(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/features/ipmi`)
      .then(({ data }) => data)
      .catch((err) => {
        if (err.status === 404) {
          return {
            activated: false,
          };
        }
        return err;
      });
  }

  ipmiStartTest(serviceName, type, ttl) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/features/ipmi/test`, {
        ttl,
        type,
      })
      .then(({ data }) => data);
  }

  ipmiStartConnection({
    serviceName,
    type,
    ttl,
    ipToAllow,
    sshKey,
    withGeolocation,
  }) {
    let promise = this.$q.when(ipToAllow);
    if (withGeolocation) {
      promise = this.getIpGeolocation().then(({ ip }) => ip);
    }
    return promise.then((ip) =>
      this.$http
        .post(`/dedicated/server/${serviceName}/features/ipmi/access`, {
          ttl,
          type,
          sshKey,
          ipToAllow: ip,
        })
        .then(({ data }) => data),
    );
  }

  ipmiGetConnection(serviceName, type) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/features/ipmi/access?type=${type}`)
      .then(({ data }) => data);
  }

  ipmiRestart(serviceName) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/features/ipmi/resetInterface`)
      .then(({ data }) => data);
  }

  ipmiSessionsReset(serviceName) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/features/ipmi/resetSessions`)
      .then(({ data }) => data);
  }

  getIpGeolocation() {
    return this.$http.post('/me/geolocation').then(({ data }) => data);
  }

  getTaskInProgress(serviceName, type) {
    return this.$http
      .get(`/sws/dedicated/server/${serviceName}/tasks/uncompleted`, {
        serviceType: 'aapi',
        params: {
          type,
        },
      })
      .then(({ data }) => data);
  }

  createAndAssignNewCart() {
    return this.$http
      .post('/order/cart', {
        ovhSubsidiary: this.user.ovhSubsidiary,
      })
      .then(({ data }) =>
        this.$http.post(`/order/cart/${data.cartId}/assign`).then(() => ({
          cartId: data.cartId,
        })),
      );
  }

  addKvmOptionToCart(cartId, duration, pricingMode, quantity) {
    return this.$http
      .post(`/order/cart/${cartId}/eco`, {
        duration,
        planCode: KVM_PLAN_CODE,
        pricingMode,
        quantity,
      })
      .then(({ data }) => data);
  }

  addKvmConfigurationToCart(itemId, cartId, serviceName, datacenter) {
    return this.$q.all([
      this.$http.post(`/order/cart/${cartId}/item/${itemId}/configuration`, {
        label: 'dedicated_datacenter',
        value: datacenter,
      }),
      this.$http.post(`/order/cart/${cartId}/item/${itemId}/configuration`, {
        label: 'server',
        value: serviceName,
      }),
    ]);
  }

  checkoutCart(cartId) {
    return this.$http
      .post(`/order/cart/${cartId}/checkout`, {
        autoPayWithPreferredPaymentMethod: false,
      })
      .then(({ data }) => data);
  }

  getCart(cartId) {
    return this.$http
      .get(`/order/cart/${cartId}/checkout`)
      .then(({ data }) => ({
        cartId,
        ...data,
      }));
  }

  prepareKvmCart(serviceName, datacenter) {
    let cartId = '';

    return this.createAndAssignNewCart()
      .then((data) => {
        cartId = data.cartId;
        return this.addKvmOptionToCart(cartId, 'P1M', 'default', 1);
      })
      .then(({ itemId }) =>
        this.addKvmConfigurationToCart(itemId, cartId, serviceName, datacenter),
      )
      .then(() => this.getCart(cartId))
      .catch(() => this.$http.delete(`/order/cart/${cartId}`));
  }

  orderKvm(cartId) {
    return this.checkoutCart(cartId);
  }
}
