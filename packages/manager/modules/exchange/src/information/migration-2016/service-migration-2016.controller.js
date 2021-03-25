export default class ExchangeMigration2016Ctrl {
  /* @ngInject */
  constructor($scope, wucExchange, navigation, messaging, $translate, $window) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      messaging,
      $translate,
      $window,
    };
  }

  $onInit() {
    this.curExchange = this.services.navigation.currentActionData;
    this.model = {};
    this.agree = {
      value: false,
    };

    this.services.$scope.submitting = () => this.submitting();

    this.retrievingContracts();
  }

  retrievingContracts() {
    this.agree.value = false;

    return this.services.wucExchange
      .getUpgradeInfos(this.curExchange)
      .then((data) => {
        this.model.contracts = data.contracts;
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_upgrade_get_contracts_error',
          ),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  submitting() {
    return this.services.wucExchange
      .upgradeExchange(this.curExchange)
      .then((order) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_ACTION_order_upgrade_success',
            {
              t0: order.url,
              t1: order.orderId,
            },
          ),
        );
        this.services.$window.open(order.url, '_blank');
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_order_upgrade_error',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
