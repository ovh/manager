import { SUPPORT_URLS } from '../../../../../app.constants';

export default /* @ngInject */ function TelecomTelephonyServiceAssistSupportCtrl(
  $stateParams,
  coreConfig,
  TelephonyMediator,
  URLS,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.service = null;
  self.guideUrl = URLS.guides.telephony;
  self.user = coreConfig.getUser();
  self.supportUrl = SUPPORT_URLS.viewTickets + self.user.ovhSubsidiary;

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
