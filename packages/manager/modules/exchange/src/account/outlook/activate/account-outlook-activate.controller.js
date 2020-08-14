export default class ExchangeActivateOutlookCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    exchangeAccountOutlook,
    navigation,
    messaging,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      exchangeAccountOutlook,
      navigation,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.account = navigation.currentActionData;

    $scope.activateOutlookExchangeAccount = () =>
      this.activateOutlookExchangeAccount();
  }

  activateOutlookExchangeAccount() {
    this.services.exchangeAccountOutlook
      .activateOutlook(
        this.$routerParams.organization,
        this.$routerParams.productId,
        {
          primaryEmailAddress: this.account.primaryEmailAddress,
        },
      )
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_ACTION_update_account_success_message',
          ),
        );
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_common_error'),
          error,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
