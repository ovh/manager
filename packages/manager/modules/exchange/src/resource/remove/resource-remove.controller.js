export default class ExchangeRemoveResourceCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeResources,
    navigation,
    messaging,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeResources,
      navigation,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.resource = navigation.currentActionData;

    $scope.submit = () => this.submit();
  }

  submit() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    return this.services.ExchangeResources.removeResource(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.resource.resourceEmailAddress,
    )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_remove_resource_success',
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_remove_resource_failure',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
