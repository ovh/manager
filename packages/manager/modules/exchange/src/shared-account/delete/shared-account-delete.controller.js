export default class ExchangeDeleteSharedAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeSharedAccounts,
    navigation,
    messaging,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeSharedAccounts,
      navigation,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.account = navigation.currentActionData;

    $scope.submitting = () => this.submitting();
  }

  submitting() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    return this.services.ExchangeSharedAccounts.deletingSharedAccount(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.account.primaryEmailAddress,
    )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_account_remove_success',
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_account_remove_failure',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
