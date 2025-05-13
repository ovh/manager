export default class ExchangeRemoveManagerCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, navigation, $translate, messaging) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      $translate,
      messaging,
    };

    this.$routerParams = wucExchange.getParams();
    this.manager = navigation.currentActionData.manager;

    $scope.submit = () => this.submit();
  }

  submit() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    this.services.wucExchange
      .removeManager(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams.group,
        this.manager.id,
      )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_GROUPS_remove_manager_success_message',
            {
              t0: this.manager.primaryEmailAddress,
              t1: this.$routerParams.group,
            },
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_GROUPS_remove_manager_error_message',
            {
              t0: this.manager.primaryEmailAddress,
              t1: this.$routerParams.group,
            },
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
