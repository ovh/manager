export default /* @ngInject */ function TelecomTelephonyAliasConfigurationOvhPabxSoundsCtrl(
  $q,
  $stateParams,
  $translate,
  TelephonyMediator,
  TucToast,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.model = {
    file: null,
  };

  self.number = null;
  self.uploadErrors = null;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.hasError = function hasError() {
    return (
      self.uploadErrors.extension ||
      self.uploadErrors.size ||
      self.uploadErrors.name ||
      self.uploadErrors.exists
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.number = group.getNumber($stateParams.serviceName);

        return self.number.feature.init().then(() => {
          if (self.number.getFeatureFamily() === 'ovhPabx') {
            return self.number.feature.getSounds();
          }
          return null;
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_alias_configuration_load_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  /* -----  End of INITIALIZATION  ------*/
}
