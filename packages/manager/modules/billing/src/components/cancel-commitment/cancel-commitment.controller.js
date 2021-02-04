export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  cancelCommitment() {
    if (this.trackClick) {
      this.trackClick();
    }
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
            `${this.$translate.instant('billing_cancel_commitment_error')}${
              error.data?.message
            }`,
          ),
        'error',
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
