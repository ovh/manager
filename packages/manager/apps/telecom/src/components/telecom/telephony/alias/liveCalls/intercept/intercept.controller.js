import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationLiveCallsInterceptCtrl(
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
      .intercept(
        {
          billingAccount: params.billingAccount,
          serviceName: params.serviceName,
          queueId: params.queueId,
          id: params.callId,
        },
        {
          number: self.number,
        },
      )
      .$promise.then(() => {
        $uibModalInstance.dismiss();
        TucToast.success(
          $translate.instant(
            'telephony_alias_configuration_mode_calls_action_intercept_success',
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
