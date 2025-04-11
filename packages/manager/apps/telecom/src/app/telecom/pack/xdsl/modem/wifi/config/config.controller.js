export default /* @ngInject */ function XdslModemWifiConfigCtrl(
  $state,
  $q,
  $http,
  $stateParams,
  $translate,
  TucToast,
) {
  const self = this;
  self.modem = null;

  self.loaders = {
    wifi: false,
  };

  function getModem() {
    return $http.get(`/xdsl/${$stateParams.serviceName}/modem`);
  }

  function checkForLegacyConfigDisplay(capabilities, managedByOvh) {
    return !capabilities?.canUseWifiRadio && managedByOvh;
  }

  function checkForConfigDisplay(capabilities) {
    return capabilities?.canUseWifiRadio;
  }

  self.$onInit = function $onInit() {
    self.serviceName = $stateParams.serviceName;
    self.loaders.wifi = true;
    return getModem().then(
      ({ data }) => {
        self.modem = data;
        const { capabilities, managedByOvh } = self.modem;
        self.canChangeWifiRadio = capabilities.canChangeWifiRadio;
        self.canChangeWifiSSID = capabilities.canChangeWifiSSID;
        self.isLegacyConfigDisplayed = checkForLegacyConfigDisplay(
          capabilities,
          managedByOvh,
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
}
