import angular from 'angular';

export default class ExchangeRemoveExchangeCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    $translate,
    atInternet,
    navigation,
    messaging,
    exchangeServiceInfrastructure,
    exchangeVersion,
  ) {
    this.services = {
      $scope,
<<<<<<< HEAD
      wucExchange,
=======
      atInternet,
      Exchange,
>>>>>>> feat(web-cloud): add tracking to termination
      $translate,
      navigation,
      messaging,
      exchangeServiceInfrastructure,
      exchangeVersion,
    };

    this.$routerParams = wucExchange.getParams();
    this.exchange = angular.copy(wucExchange.value);
    this.exchange.renewPeriod = 'YEARLY';
    this.dialogTypeSeparator = this.exchange.renewType.deleteAtExpiration
      ? 'cancel_'
      : '';

    $scope.getSubmitButtonLabel = () => this.getSubmitButtonLabel();
    $scope.submit = () => this.submit();
  }

  getModel() {
    return {
      exchangeType: this.exchange.offer,
      deleteAtExpiration: !this.exchange.renewType.deleteAtExpiration, // switch the actual value
      renewPeriod: this.exchange.renewPeriod,
      automatic: this.exchange.renewType.automatic,
    };
  }

  getSubmitButtonLabel() {
    return this.services.$translate.instant(
      `exchange_resilitation_${this.dialogTypeSeparator}action_button`,
    );
  }

  submit() {
    this.services.atInternet.trackClick({
      name: `web::microsoft::exchange::${
        this.exchange.domain.split('-')[0] === 'hosted' ? 'hosted' : 'dedicated'
      }::delete::confirm`,
      type: 'action',
    });
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    this.services.wucExchange
      .updateDeleteAtExpiration(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.getModel(),
      )
      .then((data) => {
        const updateRenewMessages = {
          OK: this.services.$translate.instant(
            `exchange_resilitation_${this.dialogTypeSeparator}action_success`,
          ),
          PARTIAL: this.services.$translate.instant(
            `exchange_resilitation_${this.dialogTypeSeparator}action_partial`,
          ),
          ERROR: this.services.$translate.instant(
            `exchange_resilitation_${this.dialogTypeSeparator}action_failure`,
          ),
        };

        this.services.messaging.setMessage(updateRenewMessages, data);
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            `exchange_resilitation_${this.dialogTypeSeparator}action_failure`,
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
