export default class ExchangeRemoveGroupCtrl {
  /* @ngInject */
  constructor($scope, Exchange, navigation, $translate, messaging) {
    this.services = {
      $scope,
      Exchange,
      navigation,
      $translate,
      messaging,
    };
  }

  $onInit() {
    this.$routerParams = this.services.Exchange.getParams();
    this.ml = this.services.navigation.currentActionData;

    this.services.$scope.submit = () => this.submit();
  }

  submit() {
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'groupsTable',
    );

    this.services.Exchange.deleteGroup(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.ml.mailingListName,
    )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_GROUPS_delete_group_success',
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_GROUPS_delete_group_error',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
