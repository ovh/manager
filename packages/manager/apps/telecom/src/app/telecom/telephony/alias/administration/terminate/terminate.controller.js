import confirmTemplate from './confirm/confirm.html';
import controller from './confirm/confirm.controller';

export default /* @ngInject */ class TerminateController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $uibModal,
    OvhApiTelephony,
    TelephonyMediator,
    TucToast,
    TucToastError,
    tucVoipServiceAlias,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.isLoading = true;
    this.$q
      .all({
        reasons: this.getTerminationReasons(),
        task: this.getTerminationTask(),
        number: this.getNumber(),
        isSpecialNumber: this.tucVoipServiceAlias.isSpecialNumber({
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
        }),
      })
      .then(({ reasons, task, number, isSpecialNumber }) => {
        this.reasonEnum = reasons;
        this.task = task;
        this.number = number;
        this.isSpecialNumber = isSpecialNumber;
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isLoading = false;
      });
  }

  getTerminationReasons() {
    return this.TelephonyMediator.getApiScheme().then(
      (schema) => schema.models['telephony.TerminationReasonEnum'].enum,
    );
  }

  getNumber() {
    return this.TelephonyMediator.getGroup(this.billingAccount).then((group) =>
      group.getNumber(this.serviceName),
    );
  }

  getTerminationTask() {
    return this.getNumber().then((number) => number.getTerminationTask());
  }

  hasValidReason() {
    if (this.reason === 'missingOptions' || this.reason === 'other') {
      return this.details;
    }
    return this.reason;
  }

  terminate() {
    const modal = this.$uibModal.open({
      animation: true,
      template: confirmTemplate,
      controller,
      controllerAs: '$ctrl',
      resolve: {
        isSpecialNumber: () => this.isSpecialNumber,
      },
    });
    modal.result.then(() => {
      this.saveTermination();
    });
    return modal;
  }

  saveTermination() {
    this.isTerminating = true;

    return this.OvhApiTelephony.Service()
      .v6()
      .delete({
        billingAccount: this.billingAccount,
        serviceName: this.serviceName,
        details: this.details,
        reason: this.reason,
      })
      .$promise.then(() => this.getTerminationTask())
      .then((task) => {
        this.task = task;
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_administration_terminate_success',
          ),
        );
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isTerminating = false;
      });
  }

  cancelTermination() {
    this.isCancelling = true;
    return this.OvhApiTelephony.Service()
      .v6()
      .cancelTermination(
        {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
        },
        {},
      )
      .$promise.then(() => this.getTerminationTask())
      .then((task) => {
        this.task = task;
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_administration_cancel_termination_success',
          ),
        );
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isCancelling = false;
      });
  }
}
