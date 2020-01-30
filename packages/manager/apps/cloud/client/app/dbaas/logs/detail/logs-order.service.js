import assignIn from 'lodash/assignIn';
import find from 'lodash/find';
import map from 'lodash/map';

class LogsOrderService {
  constructor($q, OvhApiDbaas, CucServiceHelper, LogsOfferService) {
    this.$q = $q;
    this.OvhApiDbaasLogsOrder = OvhApiDbaas.Order().v6();
    this.CucServiceHelper = CucServiceHelper;
    this.LogsOfferService = LogsOfferService;
  }

  getOrder(serviceName) {
    return this.OvhApiDbaasLogsOrder.query({
      serviceName,
    })
      .$promise.then((plans) => {
        const promises = plans.map((plan) =>
          this.LogsOfferService.getOfferDetail(plan.planCode),
        );
        return this.$q.all(promises).then((planDetails) => {
          const list = map(plans, (item) =>
            assignIn(item, find(planDetails, { reference: item.planCode }), {
              renewalPrice: this.constructor.getRenewalPrice(item),
            }),
          );
          const sortedList = list.sort(
            (a, b) => a.renewalPrice.value - b.renewalPrice.value,
          );
          return sortedList;
        });
      })
      .catch(this.CucServiceHelper.errorHandler('logs_order_get_error'));
  }

  static getRenewalPrice(item) {
    return item.prices.filter(
      (price) => price.capacities.indexOf('renew') > -1,
    )[0].price;
  }

  saveOrder(serviceName, offerDetail) {
    return this.OvhApiDbaasLogsOrder.saveOrder(
      {
        serviceName,
        planCode: offerDetail.selectedOffer,
      },
      {
        quantity: offerDetail.quantity,
      },
    ).$promise.catch(
      this.CucServiceHelper.errorHandler('logs_order_save_order'),
    );
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
