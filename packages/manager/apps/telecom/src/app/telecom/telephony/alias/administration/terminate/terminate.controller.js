export default /* @ngInject */ function TelecomTelephonyAliasAdministrationTerminateCtrl(
  $q,
  $stateParams,
  $translate,
  OvhApiTelephony,
  TelephonyMediator,
  TucToast,
  TucToastError,
) {
  const self = this;

  function getTerminationReasons() {
    return TelephonyMediator.getApiScheme().then(
      (schema) => schema.models['telephony.TerminationReasonEnum'].enum,
    );
  }

  function getNumber() {
    return TelephonyMediator.getGroup(
      $stateParams.billingAccount,
    ).then((group) => group.getNumber($stateParams.serviceName));
  }

  function getTerminationTask() {
    return getNumber().then((number) => number.getTerminationTask());
  }

  function init() {
    self.isLoading = true;
    $q.all({
      reason: getTerminationReasons(),
      task: getTerminationTask(),
      number: getNumber(),
    })
      .then((result) => {
        self.reasonEnum = result.reason;
        self.task = result.task;
        self.number = result.number;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });
  }

  self.hasValidReason = function hasValidReason() {
    if (self.reason === 'missingOptions' || self.reason === 'other') {
      return self.details;
    }
    return self.reason;
  };

  self.terminate = function terminate() {
    self.isTerminating = true;
    OvhApiTelephony.Service()
      .v6()
      .delete({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        details: self.details,
        reason: self.reason,
      })
      .$promise.then(() => getTerminationTask())
      .then((task) => {
        self.task = task;
        TucToast.success(
          $translate.instant(
            'telephony_alias_administration_terminate_success',
          ),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isTerminating = false;
      });
  };

  self.cancelTermination = function cancelTermination() {
    self.isCancelling = true;
    OvhApiTelephony.Service()
      .v6()
      .cancelTermination(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {},
      )
      .$promise.then(() => getTerminationTask())
      .then((task) => {
        self.task = task;
        TucToast.success(
          $translate.instant(
            'telephony_alias_administration_cancel_termination_success',
          ),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isCancelling = false;
      });
  };

  init();
}
