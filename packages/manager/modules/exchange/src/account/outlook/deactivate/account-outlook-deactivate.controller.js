export default class ExchangeAccountOutlookDeactivate {
  /* @ngInject */
  constructor(
    $scope,
    Exchange,
    exchangeAccountOutlook,
    messaging,
    navigation,
    $translate,
  ) {
    this.$scope = $scope;

    this.Exchange = Exchange;
    this.exchangeAccountOutlook = exchangeAccountOutlook;
    this.messaging = messaging;
    this.navigation = navigation;
    this.$translate = $translate;
  }

  $onInit() {
    this.$routerParams = this.Exchange.getParams();
    this.account = this.navigation.currentActionData;

    this.$scope.deactivate = () => this.deactivate();
  }

  deactivate() {
    return this.exchangeAccountOutlook
      .deactivate(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.account.primaryEmailAddress,
      )
      .then(() => {
        this.messaging.writeSuccess(
          this.$translate.instant(
            'exchange_accounts_outlook_deactivate_success',
          ),
        );
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_accounts_outlook_deactivate_error'),
          error,
        );
      })
      .finally(() => {
        this.navigation.resetAction();
      });
  }
}
