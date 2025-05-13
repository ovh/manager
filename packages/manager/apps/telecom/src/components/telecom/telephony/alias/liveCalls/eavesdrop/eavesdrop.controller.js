import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationLiveCallsEavesdropCtrl(
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
    let promise = null;
    self.isSubmitting = true;
    self.error = null;

    if (!self.type) {
      promise = params.apiEndpoint
        .Hunting()
        .Queue()
        .LiveCalls()
        .v6()
        .eavesdrop(
          {
            billingAccount: params.billingAccount,
            serviceName: params.serviceName,
            queueId: params.queueId,
            id: params.callId,
          },
          {
            number: self.number,
          },
        ).$promise;
    } else {
      promise = params.apiEndpoint
        .Hunting()
        .Queue()
        .LiveCalls()
        .v6()
        .whisper(
          {
            billingAccount: params.billingAccount,
            serviceName: params.serviceName,
            queueId: params.queueId,
            id: params.callId,
          },
          {
            number: self.number,
            whisperingMode: self.type,
          },
        ).$promise;
    }

    return promise
      .then(() => {
        $uibModalInstance.dismiss();
        TucToast.success(
          $translate.instant(
            'telephony_alias_configuration_mode_calls_action_eavesdrop_success',
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
