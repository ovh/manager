import get from 'lodash/get';

angular.module('managerApp').controller('TelecomTelephonyServiceAssistSupportCtrl', function ($stateParams, TelephonyMediator, REDIRECT_URLS, URLS) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.service = null;
  self.guideUrl = URLS.guides.telephony;
  self.listTicketUrl = get(REDIRECT_URLS, 'listTicket');

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount).then(() => {
      self.service = TelephonyMediator.findService($stateParams.serviceName);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
