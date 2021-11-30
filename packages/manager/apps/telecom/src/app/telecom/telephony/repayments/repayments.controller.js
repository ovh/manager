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
  }
}
