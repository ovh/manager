export default class ExchangeRemovePublicFolderPermissionCtrl {
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

    this.folder = navigation.currentActionData.folder;
    this.permission = navigation.currentActionData.permission;

    $scope.submitting = () => this.submitting();
  }

  submitting() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    return this.services.ExchangePublicFolders.removingPublicFolderPermission(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.folder.path,
      this.permission.allowedAccountId,
    )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_action_SHARED_permissions_delete_success',
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_action_SHARED_permissions_delete_error',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
