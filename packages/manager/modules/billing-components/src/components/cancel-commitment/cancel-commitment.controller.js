export default class ServicesActionsCtrl {
  /* @ngInject */
  constructor($http, $translate, atInternet, coreConfig) {
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.isUSRegion = this.coreConfig.isRegion('US');
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
      .then(() => {
        const key = this.isUSRegion
          ? 'billing_cancel_commitment_success_us'
          : 'billing_cancel_commitment_success';
        return this.goBack(this.$translate.instant(key));
      })
      .catch((error) => {
        const key = this.isUSRegion
          ? 'billing_cancel_commitment_error_us'
          : 'billing_cancel_commitment_error';
        return this.goBack(
          `${this.$translate.instant(key)}${error.data?.message}`,
        );
      }, 'error')
      .finally(() => {
        this.isLoading = false;
      });
  }
}
