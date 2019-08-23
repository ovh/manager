angular.module('managerApp').controller('TelecomTelephonyAliasConfigurationStatsEasyHuntingCtrl', function (OvhApiTelephony) {
  const self = this;

  function init() {
    self.apiEndpoint = OvhApiTelephony.EasyHunting();
  }

  init();
});
