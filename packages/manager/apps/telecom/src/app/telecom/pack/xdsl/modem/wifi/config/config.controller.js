export default /* @ngInject */ function XdslModemWifiConfigCtrl(
  $state,
  $q,
  $stateParams,
  $translate,
  TucToast,
  OvhApiXdsl,
) {
  const self = this;
  self.modem = null;

  self.loaders = {
    wifi: false,
  };

  function getModem() {
    return OvhApiXdsl.Modem()
      .v6()
      .get({
        xdslId: $stateParams.serviceName,
      }).$promise;
  }

  function checkForLegacyConfigDisplay(capabilities) {
    return capabilities?.canChangeWLAN;
  }

  function checkForConfigDisplay(capabilities) {
    return !capabilities?.canChangeWLAN;
  }

  self.$onInit = function $onInit() {
    self.serviceName = $stateParams.serviceName;
    self.loaders.wifi = true;
    return getModem().then(
      (response) => {
        self.modem = response;
        const { capabilities } = self.modem;
        self.isLegacyConfigDisplayed = checkForLegacyConfigDisplay(
          capabilities,
        );
        self.isConfigDisplayed = checkForConfigDisplay(capabilities);
        self.loaders.wifi = false;
      },
      (err) => {
        TucToast.error($translate.instant('xdsl_modem_wifi_read_error'));
        self.loaders.wifi = false;
        return $q.reject(err);
      },
    );
  };

  self.onModemPropertiesUpdating = function(isUpdating) {
    console.log('isUpdating', isUpdating);
  };

  self.onModemPropertiesChanged = function() {
    console.log('changed');
  };
}
