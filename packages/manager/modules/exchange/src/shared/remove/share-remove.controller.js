export default class ExchangeRemoveSharedCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangePublicFolders,
    messaging,
    navigation,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangePublicFolders,
      messaging,
      navigation,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.shared = navigation.currentActionData;
    $scope.submitting = () => this.submitting();
  }

  submitting() {
    return this.services.ExchangePublicFolders.removingPublicFolders(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.shared.path,
    )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_action_SHARED_delete_success',
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_action_SHARED_delete_error',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
