import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationLiveCallsHangupCtrl(
  $uibModalInstance,
  $translate,
  TucToast,
  params,
) {
  const self = this;

  self.$onInit = function $onInit() {
    self.number = null;
    self.error = null;
    self.isSubmitting = false;
  };

  self.cancel = function cancel() {
    $uibModalInstance.dismiss();
  };

  self.submit = function submit() {
    self.isSubmitting = true;
    self.error = null;
    return params.apiEndpoint
      .Hunting()
      .Queue()
      .LiveCalls()
      .v6()
      .hangup(
        {
          billingAccount: params.billingAccount,
          serviceName: params.serviceName,
          queueId: params.queueId,
          id: params.callId,
        },
        {},
      )
      .$promise.then(() => {
        $uibModalInstance.dismiss();
        TucToast.success(
          $translate.instant(
            'telephony_alias_configuration_mode_calls_action_hangup_success',
          ),
        );
      })
      .catch((err) => {
        self.error = get(err, 'data.message') || get(err, 'message') || err;
      })
      .finally(() => {
        self.isSubmitting = false;
      });
  };
}
