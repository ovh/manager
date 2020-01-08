angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyAliasConfigurationStatsEasyHuntingCtrl',
    function TelecomTelephonyAliasConfigurationStatsEasyHuntingCtrl(
      OvhApiTelephony,
    ) {
      const self = this;

      function init() {
        self.apiEndpoint = OvhApiTelephony.EasyHunting();
      }

      init();
    },
  );
