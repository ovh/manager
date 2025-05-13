export default /* @ngInject */ function XdslAccessIpOrderCtrl(
  $translate,
  $uibModalInstance,
  data,
  OvhApiXdslIps,
  TucToast,
  TucToastError,
  URLS,
) {
  const self = this;
  const ipRange = 29;

  this.constants = {
    xdslId: data.xdslId,
    price: '',
    amountIpOrdered: 8,
    contractUrl: URLS.ipOrderContract,
    hoursBeforeActivation: 1,
    hoursBeforeCollected: 48,
    engagementMinimumMonths: 1,
  };

  this.checkbox = {
    userAcceptImmediateExecution: false,
    userAcceptModalities: false,
  };

  this.init = function init() {
    self.loading = true;
    OvhApiXdslIps.v6()
      .price(
        {
          ipRange,
        },
        null,
      )
      .$promise.then(
        (result) => {
          self.constants.price = result.text;
        },
        (err) => {
          TucToastError(err);
          $uibModalInstance.dismiss('error');
        },
      )
      .finally(() => {
        self.loading = false;
      });
  };

  this.cancel = function cancel() {
    $uibModalInstance.dismiss('cancel');
  };

  this.confirm = function confirm() {
    self.loading = true;
    OvhApiXdslIps.v6()
      .order(
        {
          xdslId: self.constants.xdslId,
        },
        null,
      )
      .$promise.then((result) => {
        TucToast.success(
          $translate.instant('pack_xdsl_access_ip_order_validation'),
        );
        $uibModalInstance.close(result);
      }, TucToastError)
      .finally(() => {
        self.loading = false;
      });
  };

  this.init();
}
