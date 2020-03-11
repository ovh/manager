export default class VpsUpgradeService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getUpgrade(serviceName, planCode) {
    return this.$http
      .get(`/order/upgrade/vps/${serviceName}/${planCode}`, {
        params: { quantity: 1 },
      })
      .then(({ data }) => data);
  }
}
