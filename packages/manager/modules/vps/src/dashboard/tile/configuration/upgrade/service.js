export default class VpsUpgradeService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getUpgrade(serviceName, planCode, params) {
    return this.$http
      .get(`/order/upgrade/vps/${serviceName}/${planCode}`, {
        params,
      })
      .then(({ data }) => data);
  }

  startUpgrade(serviceName, planCode, httpData) {
    return this.$http
      .post(`/order/upgrade/vps/${serviceName}/${planCode}`, {
        data: httpData,
      })
      .then(({ data }) => data);
  }
}
