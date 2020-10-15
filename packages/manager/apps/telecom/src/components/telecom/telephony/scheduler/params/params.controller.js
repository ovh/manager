export default /* @ngInject */ function TelephonySchedulerParamsCtrl(
  $q,
  $translate,
  telephonyScheduler,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.timeZones = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function getApiSchemas() {
    return telephonyScheduler
      .getAvailableTimeZones()
      .then((availableTimeZones) => {
        self.timeZones = availableTimeZones;
      });
  }

  self.$onInit = function $onInit() {
    self.loading.init = true;
    self.telephonySchedulerCtrl.loading.params = true;

    return getApiSchemas().finally(() => {
      self.loading.init = false;
      self.telephonySchedulerCtrl.loading.params = false;
    });
  };

  /* -----  End of INITIALIZATION  ------*/
}
