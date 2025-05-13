export default class ExchangeRemoveDomainCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeDomains,
    messaging,
    navigation,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeDomains,
      messaging,
      navigation,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.domain = navigation.currentActionData;

    $scope.submit = () => this.submit();
  }

  submit() {
    this.services.ExchangeDomains.removingDomain(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.domain.name,
    )
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_domain_remove_success',
          ),
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_domain_remove_failure',
          ),
          {
            code: this.domain.name,
            message: failure.message,
          },
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
