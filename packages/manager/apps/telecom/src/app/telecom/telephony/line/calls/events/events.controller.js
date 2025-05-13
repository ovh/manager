export default /* @ngInject */ function TelecomTelephonyLineCallsEventsCtrl(
  $q,
  $translate,
  $stateParams,
  TelephonyMediator,
  TucToast,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  /*= ====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.line = group.getLine($stateParams.serviceName);

        return $q.all({
          scheduler: self.line.getScheduler(),
          timeCondition: self.line.getTimeCondition(),
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_line_calls_events_load_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
