import head from 'lodash/head';

export default /* @ngInject */ function TelecomTelephonyLineAssistTroubleshootingProcedureCtrl(
  $stateParams,
  $scope,
  troubleshootingProcess,
  OvhApiTelephony,
) {
  const self = this;

  self.process = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.process = troubleshootingProcess;
    OvhApiTelephony.Line()
      .Phone()
      .Phonebook()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((serverUrl) => {
        self.process.siemensServerUrl = head(serverUrl);
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
