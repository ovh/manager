import head from 'lodash/head';

import { CONFIG } from '../../../../../components/telecom/telephony/alias/svaGenerator/sva-generator.constant';

export default /* @ngInject */ function TelecomTelephonyAliasSvaGeneratorCtrl(
  $stateParams,
  OvhApiTelephony,
  TucToastError,
) {
  const self = this;

  function init() {
    self.serviceName = $stateParams.serviceName;
    self.fillTypeList = CONFIG.fillType;
    self.fillType = head(self.fillTypeList);
    self.numberFormatList = CONFIG.numberFormat;
    self.numberFormat = head(self.numberFormatList);
    self.pricePerCall = 0;
    self.pricePerMinute = 0;
    self.notSupported = false;

    self.isLoading = true;
    OvhApiTelephony.Rsva()
      .v6()
      .getCurrentRateCode({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((rate) => {
        self.rate = rate;
        self.pricePerCall =
          rate.pricePerCallWithoutTax.value * CONFIG.taxCoefficient;
        self.pricePerMinute =
          rate.pricePerMinuteWithoutTax.value * CONFIG.taxCoefficient;
      })
      .catch((err) => {
        if (err && err.status === 404) {
          self.notSupported = true;
        } else {
          TucToastError(err);
        }
      })
      .finally(() => {
        self.isLoading = false;
      });
  }

  init();
}
