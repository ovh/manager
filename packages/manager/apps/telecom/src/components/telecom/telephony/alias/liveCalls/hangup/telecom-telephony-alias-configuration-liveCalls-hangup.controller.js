angular.module('managerApp').controller('TelecomTelephonyAliasConfigurationLiveCallsHangupCtrl', function ($uibModalInstance, $translate, TucToast, params) {
  const self = this;

  self.$onInit = function () {
    self.number = null;
    self.error = null;
    self.isSubmitting = false;
  };

  self.cancel = function () {
    $uibModalInstance.dismiss();
  };

  self.submit = function () {
    self.isSubmitting = true;
    self.error = null;
    return params.apiEndpoint.Hunting().Queue().LiveCalls().v6()
      .hangup({
        billingAccount: params.billingAccount,
        serviceName: params.serviceName,
        queueId: params.queueId,
        id: params.callId,
      }, {}).$promise.then(() => {
        $uibModalInstance.dismiss();
        TucToast.success($translate.instant('telephony_alias_configuration_mode_calls_action_hangup_success'));
      }).catch((err) => {
        self.error = _.get(err, 'data.message') || _.get(err, 'message') || err;
      }).finally(() => {
        self.isSubmitting = false;
      });
  };
});
