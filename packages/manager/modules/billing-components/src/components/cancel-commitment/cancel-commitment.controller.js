export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor($http, $translate, atInternet) {
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  cancelCommitment() {
    this.isLoading = true;

    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::cancel-commitment::confirm`,
        type: 'action',
      });
    }

    // cancel commitment API call
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
