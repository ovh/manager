export default class BillingAutorenewDisableDomainsBulkCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    atInternet,
    BillingAutoRenew,
    AUTORENEW_EVENT,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;

    this.atInternet = atInternet;
    this.BillingAutoRenew = BillingAutoRenew;

    this.AUTORENEW_EVENT = AUTORENEW_EVENT;
  }

  $onInit() {
    this.$scope.disableAutoRenewForDomains = () =>
      this.disableAutoRenewForDomains();
  }

  disableAutoRenewForDomains() {
    this.loading = true;

    return this.disableDomainsBulk()
      .then(() => {
        this.$scope.$emit(
          this.AUTORENEW_EVENT.DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS,
        );
        this.goBack(
          this.$translate.instant(
            'autorenew_service_disable_all_domains_success',
          ),
        );
      })
      .catch(({ message }) => {
        this.goBack(
          this.$translate.instant(
            'autorenew_service_disable_all_domains_error',
            { message },
          ),
          'danger',
        );
      })
      .finally(() => {
        this.atInternet.trackClick({
          name: 'validation_autoRenew_domains',
          type: 'action',
          chapter1: 'services',
          chapter2: 'autoRenew',
        });
      });
  }
}
