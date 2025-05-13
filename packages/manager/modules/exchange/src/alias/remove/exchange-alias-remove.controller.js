import { ALIAS_TYPE_FOR_API_PATH } from '../exchange-alias.constants';

export default class ExchangeRemoveAliasCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, messaging, $translate) {
    this.services = {
      $scope,
      messaging,
      wucExchange,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    $scope.submit = () => this.submit();
  }

  submit() {
    this.services.wucExchange
      .deleteAlias(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams[this.aliasType],
        ALIAS_TYPE_FOR_API_PATH[this.aliasType],
        this.$routerParams.alias,
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
        this.goBack();
      });
  }
}
