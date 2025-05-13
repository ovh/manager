export default /* @ngInject */ function TelecomTelephonyAliasConfigurationStatsEasyHuntingCtrl(
  OvhApiTelephony,
) {
  const self = this;

  function init() {
    self.apiEndpoint = OvhApiTelephony.EasyHunting();
  }

  init();
}
