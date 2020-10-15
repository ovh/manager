import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyServiceAssistSupportCtrl(
  $stateParams,
  TelephonyMediator,
  REDIRECT_URLS,
  URLS,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.service = null;
  self.guideUrl = URLS.guides.telephony;
  self.supportUrl = get(REDIRECT_URLS, 'support');

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then(() => {
        self.service = TelephonyMediator.findService($stateParams.serviceName);
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
