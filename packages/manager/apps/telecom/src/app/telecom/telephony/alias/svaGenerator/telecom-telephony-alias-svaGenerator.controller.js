angular.module('managerApp').controller('TelecomTelephonyAliasSvaGeneratorCtrl', function ($stateParams, OvhApiTelephony, TucToastError, SvaGeneratorConfig) {
  const self = this;

  function init() {
    self.serviceName = $stateParams.serviceName;
    self.fillTypeList = SvaGeneratorConfig.fillType;
    self.fillType = _.first(self.fillTypeList);
    self.numberFormatList = SvaGeneratorConfig.numberFormat;
    self.numberFormat = _.first(self.numberFormatList);
    self.pricePerCall = 0;
    self.pricePerMinute = 0;
    self.notSupported = false;

    self.isLoading = true;
    OvhApiTelephony.Rsva().v6().getCurrentRateCode({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise.then((rate) => {
      self.rate = rate;
      self.pricePerCall = rate.pricePerCallWithoutTax.value * SvaGeneratorConfig.taxCoefficient;
      self.pricePerMinute = rate.pricePerMinuteWithoutTax.value * SvaGeneratorConfig.taxCoefficient;
    }).catch((err) => {
      if (err && err.status === 404) {
        self.notSupported = true;
      } else {
        TucToastError(err);
      }
    }).finally(() => {
      self.isLoading = false;
    });
  }

  init();
});
