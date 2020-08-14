export default class ExchangeUpgrade300GCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, $window, navigation, messaging, $translate) {
    this.services = {
      $scope,
      wucExchange,
      $window,
      navigation,
      messaging,
      $translate,
    };

    $scope.getDuration = () => this.duration.value;
    $scope.getPrices = () => this.getPrices();
    $scope.closeExportWindow = () => this.closeExportWindow();
    $scope.confirmAction = () => this.confirmAction();

    this.duration = {
      value: '01',
    };

    this.primaryEmailAddress = navigation.currentActionData.primaryEmailAddress;

    this.$routerParams = wucExchange.getParams();
    this.exchange = wucExchange.value;
  }

  closeExportWindow() {
    this.services.navigation.resetAction();
  }

  getPrices() {
    this.services.wucExchange
      .getAccountUpgradeOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
        {
          newQuota: 300,
          primaryEmailAddress: this.primaryEmailAddress,
          duration: '01',
        },
      )
      .then((data) => {
        this.price1M = data.prices;
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_order_upgrade_300G_error_options_message',
          ),
          error,
        );
        this.services.navigation.resetAction();
      });

    this.services.wucExchange
      .getAccountUpgradeOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
        {
          newQuota: 300,
          primaryEmailAddress: this.primaryEmailAddress,
          duration: '12',
        },
      )
      .then((data) => {
        this.price12M = data.prices;
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_order_upgrade_300G_error_options_message',
          ),
          error,
        );
        this.services.navigation.resetAction();
      });
  }

  getDuration() {
    return this.duration.value;
  }

  confirmAction() {
    const params = {
      newQuota: 300,
      primaryEmailAddress: this.primaryEmailAddress,
      duration: this.duration.value,
    };

    this.services.wucExchange
      .orderAccountUpgrade(
        this.$routerParams.organization,
        this.$routerParams.productId,
        params,
      )
      .then((result) => {
        const confirmationMessage = this.services.$translate.instant(
          'exchange_ACTION_order_upgrade_300G_success_confirmation',
        );
        const successMessage = this.services.$translate.instant(
          'exchange_ACTION_order_upgrade_300G_success_bc',
        );
        const detailMessage = this.services.$translate.instant(
          'exchange_ACTION_order_upgrade_300G_success_details',
        );
        const link = `<a href="${result.url}" target="_blank">${successMessage}</a>`;

        this.services.$window.open(result.url, '_blank'); // Won't work as link was retrieved from ajax query

        this.services.messaging.writeSuccess(
          `${confirmationMessage} ${link}<br />${detailMessage}`,
        );
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_order_upgrade_300G_error_message',
          ),
          error,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
