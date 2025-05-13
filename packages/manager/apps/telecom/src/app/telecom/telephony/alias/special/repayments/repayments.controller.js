import get from 'lodash/get';
import partition from 'lodash/partition';
import orderBy from 'lodash/orderBy';

import { LIMIT } from './repayments.constants';

export default class TelecomTelephonyAliasSpecialRepaymentsCtrl {
  /* @ngInject */
  constructor($state, $stateParams, $http, coreConfig, TucToast) {
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.TucToast = TucToast;

    this.currency = coreConfig.getUser().currency.symbol;

    this.getRepayementsTotalPrice = (repayments) =>
      repayments.reduce(
        (total, repayment) => total + repayment.price * 1000,
        0,
      ) / 1000;
  }

  $onInit() {
    this.repayments = [];
    this.repaymentsInfos = {
      availableRepayments: null,
      pendingRepayments: null,
      feesToPay: null,
    };

    this.loading = true;

    return this.$http
      .get(`/telephony/${this.$stateParams.billingAccount}/repayment`, {
        params: {
          serviceName: this.$stateParams.serviceName,
        },
        serviceType: 'aapi',
      })
      .then((result) => {
        const repayments = result.data;
        this.allRepayments = repayments;
        this.repayments = repayments.slice(0, LIMIT);

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

  onSortChanged($sort) {
    if (this.allRepayments.length < LIMIT) {
      return;
    }

    this.repayments = orderBy(
      this.allRepayments,
      [$sort.name],
      [$sort.order],
    ).slice(0, LIMIT);
  }

  onPageChanged($pagination) {
    if (this.allRepayments.length < LIMIT) {
      return;
    }

    this.repayments = this.allRepayments.slice($pagination.offset - 1, LIMIT);
  }
}
