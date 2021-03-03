export default class ExchangeSslRenewCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, messaging, navigation, $translate) {
    this.services = {
      $scope,
      wucExchange,
      messaging,
      navigation,
      $translate,
    };
  }

  $onInit() {
    this.$routerParams = this.services.wucExchange.getParams();
    this.loading = false;
    this.exchange = this.services.wucExchange.value;

    this.services.$scope.submitting = () => this.submitting();

    this.retrievingDCVEmails();
  }

  retrievingDCVEmails() {
    this.loading = true;

    return this.services.wucExchange
      .retrievingDVCEmails(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((data) => {
        this.loading = false;
        this.availableDomains = data;
        this.model = {
          name: '',
        };
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_renew_ssl_dcv_failure',
          ),
          failure,
        );
      });
  }

  submitting() {
    return this.services.wucExchange
      .renewSsl(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.model.name,
      )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_ACTION_renew_ssl_success',
            {
              t0: this.model.displayName,
            },
          ),
          data,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_renew_ssl_failure'),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
