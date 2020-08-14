export default class ExchangeRemoveAliasCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, navigation, $translate) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.account = navigation.currentActionData.account;
    this.alias = navigation.currentActionData.alias;

    $scope.submit = () => this.submit();
  }

  submit() {
    this.services.wucExchange
      .deleteAlias(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.account.primaryEmailAddress,
        this.alias.alias,
      )
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_delete_success_message',
          ),
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
