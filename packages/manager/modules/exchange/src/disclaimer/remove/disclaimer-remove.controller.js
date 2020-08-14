export default class ExchangeRemoveDisclaimerCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, navigation, messaging, $translate) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.disclaimer = navigation.currentActionData;

    $scope.submit = () => this.submit();
  }

  submit() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    this.services.wucExchange
      .deleteDisclaimer(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.disclaimer.domain.name,
      )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_ACTION_delete_disclaimer_success',
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_delete_disclaimer_failure',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
