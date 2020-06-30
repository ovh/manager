class LogsOrderService {
  /* @ngInject */
  constructor($q, OvhApiDbaas, CucServiceHelper) {
    this.$q = $q;
    this.OvhApiDbaasLogsOrder = OvhApiDbaas.Order().v6();
    this.CucServiceHelper = CucServiceHelper;
  }

  getOrderCatalog(ovhSubsidiary) {
    return this.OvhApiDbaasLogsOrder.getCatalog({
      ovhSubsidiary,
    }).$promise.catch(
      this.CucServiceHelper.errorHandler('logs_order_get_error'),
    );
  }
}

angular.module('managerApp').service('LogsOrderService', LogsOrderService);
