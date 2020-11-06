export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  cancelCommitment() {
    this.isLoading = true;
    return this.$http
      .delete(`/services/${this.serviceId}/billing/engagement/request`)
      .then(() =>
        this.goBack(
          this.$translate.instant('billing_cancel_commitment_success'),
        ),
      )
      .catch(
        (error) =>
          this.goBack(
            this.$translate.instant('billing_cancel_commitment_error', {
              message: error,
            }),
          ),
        'error',
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
