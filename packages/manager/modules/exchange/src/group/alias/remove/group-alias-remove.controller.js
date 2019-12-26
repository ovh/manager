export default class ExchangeRemoveGroupAliasCtrl {
  /* @ngInject */
  constructor($scope, Exchange, navigation, $translate, messaging) {
    this.services = {
      $scope,
      Exchange,
      navigation,
      $translate,
      messaging,
    };

    this.$routerParams = Exchange.getParams();
  }

  $onInit() {
    this.selectedGroup = this.services.navigation.currentActionData.selectedGroup;
    this.alias = this.services.navigation.currentActionData.alias;

    this.services.$scope.submit = () => this.submit();
  }

  submit() {
    this.services.Exchange.deleteGroupAlias(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.selectedGroup.mailingListAddress,
      this.alias.alias,
    )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_delete_success_message',
          ),
          success,
        );
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_delete_error_message',
          ),
          err,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
