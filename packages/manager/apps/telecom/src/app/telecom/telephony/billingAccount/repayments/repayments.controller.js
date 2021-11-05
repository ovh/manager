import { REPAYMENT_AMOUNT_THRESHOLD } from './repayments.constants';
import {
  calculateTotalRepayments,
  formatRepayments,
} from './repayments.helpers';

export default class TelecomTelephonyRepaymentsCtrl {
  /* @ngInject  */
  constructor($http, $q, $stateParams, $translate, TucToast) {
    this.$http = $http;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;

    this.TucToast = TucToast;

    this.hasReachedRepaymentAmountThreshold = false;
    this.loading = false;
    this.nextRepaymentDate = new Date();
    this.repayments = [];
  }

  $onInit() {
    this.loading = true;
    this.fetchRepayments()
      .then((repayments) => {
        const totalRepayments = calculateTotalRepayments(repayments);
        const formatedRepayments = formatRepayments(repayments);

        this.hasReachedRepaymentAmountThreshold =
          totalRepayments >= REPAYMENT_AMOUNT_THRESHOLD;
        this.repayments = formatedRepayments;
      })
      .catch((error) => {
        const base = this.$translate.instant('telephony_repayments_error');
        const message = error.data?.message || error.message;
        const reason = message ? ` (${message})` : '';
        this.TucToast.error(base + reason);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchRepayments() {
    return this.$http.get('/me/sva/cdr').then(({ data }) => data);
  }
}
