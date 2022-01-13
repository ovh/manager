export default class ByoipService {
  /* @ngInject */
  constructor($http, $q, coreConfig, User) {
    this.$http = $http;
    this.$q = $q;
    this.User = User;
    this.coreConfig = coreConfig;
  }

  getCatalog() {
    const user = this.coreConfig.getUser();
    return this.$http
      .get('/order/catalog/formatted/bringYourOwnIp', {
        params: {
          ovhSubsidiary: user.ovhSubsidiary,
        },
      })
      .then(({ data }) => {
        return data.plans[0];
      });
  }

  getToken(region) {
    return this.$http
      .get('/me/bringYourOwnIp/token', {
        params: {
          campus: region,
        },
        cache: this.cache,
      })
      .then(({ data }) => data);
  }

  /**
   * Redirect to the express order page
   * @param {Object} plan [detials of the plan]
   * @param {config} array [configuration of the plan like name, region and others]
   */
  getExpressOrder(plan, config) {
    const params = [
      {
        planCode: plan.planCode,
        configuration: config,
        option: [],
        quantity: 1,
        productId: 'bringYourOwnIp',
      },
    ];

    return this.getExpressOrderUrl(params);
  }

  getExpressOrderUrl(payload) {
    return this.User.getUrlOf('express_order').then((url) => {
      return `${url}review?products=${JSURL.stringify(payload)}`;
    });
  }
}
