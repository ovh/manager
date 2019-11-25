angular.module('Module.exchange.controllers').controller(
  'ExchangeRemoveAccountCtrl',
  class ExchangeRemoveAccountCtrl {
    constructor(
      $q,
      $scope,
      $timeout,
      Exchange,
      exchangeAccount,
      navigation,
      messaging,
      $translate,
    ) {
      this.services = {
        $q,
        $scope,
        $timeout,
        Exchange,
        exchangeAccount,
        navigation,
        messaging,
        $translate,
      };

      $scope.getTitle = () => this.getTitle();
      this.$routerParams = Exchange.getParams();
      this.account = navigation.currentActionData;
      this.removeAccountInsteadOfReset = Exchange.removeAccountInsteadOfReset(Exchange.value);
    }

    getTitle() {
      return this.removeAccountInsteadOfReset
        ? this.services.$translate.instant('exchange_tab_account_remove_account')
        : this.services.$translate.instant('exchange_tab_account_reset_account');
    }

    submit() {
      this.isLoading = true;
      const mfaPromise = this.account.mfa.status === 'ENABLED'
        ? this.services.exchangeAccount.deleteMfa(
          this.services.Exchange.value.domain,
          this.account.primaryEmailAddress,
        )
        : this.services.$q.resolve(true);

      return mfaPromise
        .then(() => this.services.$timeout(5000))
        .then(() => this.services.Exchange.removingAccount(
          this.$routerParams.organization,
          this.$routerParams.productId,
          this.account.primaryEmailAddress,
        )
          .then((success) => {
            this.services.messaging.writeSuccess(
              this.removeAccountInsteadOfReset
                ? this.services.$translate.instant('exchange_tab_account_remove_success')
                : this.services.$translate.instant('exchange_tab_account_reset_success'),
              success,
            );
          })
          .catch((failure) => {
            this.services.messaging.writeError(
              this.removeAccountInsteadOfReset
                ? this.services.$translate.instant('exchange_tab_account_remove_failure')
                : this.services.$translate.instant('exchange_tab_account_reset_failure'),
              failure,
            );
          })
          .finally(() => {
            this.services.navigation.resetAction();
            this.isLoading = false;
          }));
    }
  },
);
