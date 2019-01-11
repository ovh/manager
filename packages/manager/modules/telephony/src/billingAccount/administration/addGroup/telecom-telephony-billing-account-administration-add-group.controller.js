angular.module('managerApp').controller('TelecomTelephonyBillingAccountAdministrationAddGroup', function ($stateParams, $translate, $timeout, OvhApiOrderTelephony, TucToastError) {
  const self = this;

  self.$onInit = function () {
    self.loading = true;
    self.contractsAccepted = false;
    self.order = null;
    OvhApiOrderTelephony.v6().getNewBillingAccount().$promise.then((result) => {
      self.contracts = result.contracts;
      self.prices = result.prices;
    }, err => new TucToastError(err)).finally(() => {
      self.loading = false;
    });
  };

  self.getDisplayedPrice = function () {
    if (_.get(self, 'prices.withTax.value') === 0) {
      return $translate.instant('telephony_add_group_free');
    }
    return _.get(self, 'prices.withTax.text', '-');
  };

  self.orderGroup = function () {
    self.ordering = true;
    return OvhApiOrderTelephony.v6().orderNewBillingAccount().$promise.then((order) => {
      self.order = order;
    }, err => new TucToastError(err)).finally(() => {
      self.ordering = false;
    });
  };
});
