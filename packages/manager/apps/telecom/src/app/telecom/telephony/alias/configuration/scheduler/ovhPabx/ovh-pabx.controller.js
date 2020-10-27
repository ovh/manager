export default /* @ngInject */ function TelecomTelephonyAliasConfigurationSchedulerOvhPabxCtrl(
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

  self.group = null;
  self.number = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.group = group;
        self.number = self.group.getNumber($stateParams.serviceName);

        return self.number.feature
          .init()
          .then(() => self.number.feature.getScheduler());
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_alias_configuration_scheduler_load_error',
            ),
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
