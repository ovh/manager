export default class LogsOrderService {
  /* @ngInject */
  constructor($q, $http, CucServiceHelper) {
    this.$q = $q;
    this.$http = $http;
    this.CucServiceHelper = CucServiceHelper;
  }

  getOrderCatalog() {
    return this.$http
      .get(`/me`)
      .then((me) => {
        return this.$http
          .get(`/order/catalog/formatted/logs`, {
            params: { ovhSubsidiary: me.data.ovhSubsidiary },
          })
          .then(({ data }) => data);
      })
      .catch(this.CucServiceHelper.errorHandler('logs_order_get_error'));
  }
}
