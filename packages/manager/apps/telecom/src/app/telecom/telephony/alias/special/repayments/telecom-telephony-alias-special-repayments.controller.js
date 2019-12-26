import get from 'lodash/get';
import partition from 'lodash/partition';
import startsWith from 'lodash/startsWith';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasSpecialRepaymentsCtrl',
  class TelecomTelephonyAliasSpecialRepaymentsCtrl {
    constructor(
      $state,
      $stateParams,
      TucToast,
      tucVoipService,
      TELEPHONY_REPAYMENT_CONSUMPTION,
    ) {
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.TucToast = TucToast;
      this.tucVoipService = tucVoipService;
      this.TELEPHONY_REPAYMENT_CONSUMPTION = TELEPHONY_REPAYMENT_CONSUMPTION;
    }

    $onInit() {
      this.repayments = [];
      this.repaymentsInfos = {
        availableRepayments: null,
        pendingRepayments: null,
        feesToPay: null,
      };

      this.serviceInfos = {
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
      };

      this.loading = true;
      this.decimalPrecision = 1000;

      return this.tucVoipService
        .fetchServiceRepayments(this.serviceInfos)
        .then((repayments) => {
          this.repayments = repayments.map((repayment) => {
            const newRepayment = repayment;
            newRepayment.price =
              Math.round(Math.abs(repayment.price) * this.decimalPrecision) /
              this.decimalPrecision;

            newRepayment.isFee = this.TELEPHONY_REPAYMENT_CONSUMPTION.calledFeesPrefix.fr
              .concat(this.TELEPHONY_REPAYMENT_CONSUMPTION.calledFeesPrefix.be)
              .some((prefix) => startsWith(repayment.dialed, prefix));

            return newRepayment;
          });

          let otherRepayments = [];
          [this.repaymentsInfos.feesToPay, otherRepayments] = partition(
            this.repayments,
            ({ isFee }) => isFee,
          );

          [
            this.repaymentsInfos.availableRepayments,
            this.repaymentsInfos.pendingRepayments,
          ] = partition(otherRepayments, ({ repayable }) => repayable);
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_special_repayments_get_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    getRepayementsTotalPrice(repayments) {
      return (
        Math.round(
          repayments.reduce((total, repayment) => total + repayment.price, 0) *
            this.decimalPrecision,
        ) / this.decimalPrecision
      );
    }
  },
);
