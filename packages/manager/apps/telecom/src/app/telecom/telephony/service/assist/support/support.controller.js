export default /* @ngInject */ function TelecomTelephonyServiceAssistSupportCtrl(
  $stateParams,
  coreURLBuilder,
  TelephonyMediator,
  URLS,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.service = null;
  self.guideUrl = URLS.guides.telephony;
  self.supportUrl = coreURLBuilder.buildURL('dedicated', '#/support');

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then(() =>
        TelephonyMediator.findService($stateParams.serviceName).then(
          (service) => {
            self.service = service;
          },
        ),
      )
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
