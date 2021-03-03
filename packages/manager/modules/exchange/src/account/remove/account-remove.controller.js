export default class ExchangeRemoveAccountCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $timeout,
    wucExchange,
    exchangeAccount,
    navigation,
    messaging,
    $translate,
  ) {
    this.services = {
      $q,
      $scope,
      $timeout,
      wucExchange,
      exchangeAccount,
      navigation,
      messaging,
      $translate,
    };

    $scope.getTitle = () => this.getTitle();
    this.$routerParams = wucExchange.getParams();
    this.account = navigation.currentActionData;
    this.removeAccountInsteadOfReset = wucExchange.removeAccountInsteadOfReset(
      wucExchange.value,
    );
  }

  getTitle() {
    return this.removeAccountInsteadOfReset
      ? this.services.$translate.instant('exchange_tab_account_remove_account')
      : this.services.$translate.instant('exchange_tab_account_reset_account');
  }

  submit() {
    this.isLoading = true;

    return this.services.wucExchange
      .removingAccount(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.account.primaryEmailAddress,
      )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.removeAccountInsteadOfReset
            ? this.services.$translate.instant(
                'exchange_tab_account_remove_success',
              )
            : this.services.$translate.instant(
                'exchange_tab_account_reset_success',
              ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.removeAccountInsteadOfReset
            ? this.services.$translate.instant(
                'exchange_tab_account_remove_failure',
              )
            : this.services.$translate.instant(
                'exchange_tab_account_reset_failure',
              ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
        this.isLoading = false;
      });
  }
}
