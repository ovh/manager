import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyBillingAccountAdministrationAddGroup(
  $stateParams,
  $translate,
  $timeout,
  OvhApiOrderTelephony,
  TucToastError,
) {
  const self = this;

  self.$onInit = function $onInit() {
    self.loading = true;
    self.contractsAccepted = false;
    self.order = null;
    OvhApiOrderTelephony.v6()
      .getNewBillingAccount()
      .$promise.then(
        (result) => {
          self.contracts = result.contracts;
          self.prices = result.prices;
        },
        (err) => new TucToastError(err),
      )
      .finally(() => {
        self.loading = false;
      });
  };

  self.getDisplayedPrice = function getDisplayedPrice() {
    if (get(self, 'prices.withTax.value') === 0) {
      return $translate.instant('telephony_add_group_free');
    }
    return get(self, 'prices.withTax.text', '-');
  };

  self.orderGroup = function orderGroup() {
    self.ordering = true;
    return OvhApiOrderTelephony.v6()
      .orderNewBillingAccount()
      .$promise.then(
        (order) => {
          self.order = order;
        },
        (err) => new TucToastError(err),
      )
      .finally(() => {
        self.ordering = false;
      });
  };
}
