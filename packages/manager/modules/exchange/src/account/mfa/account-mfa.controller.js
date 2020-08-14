export default class ExchangeAccountMfaCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $translate,
    wucExchange,
    exchangeAccount,
    messaging,
    navigation,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.wucExchange = wucExchange;
    this.exchangeAccount = exchangeAccount;
    this.exchangeService = wucExchange.value;
    this.isLoading = false;
    this.messaging = messaging;
    this.navigation = navigation;
  }

  $onInit() {
    this.account = this.navigation.currentActionData.account;
    this.action = this.navigation.currentActionData.action;
    this.isLoading = true;
    this.wucExchange
      .getExchangeServer(
        this.exchangeService.organization,
        this.exchangeService.domain,
      )
      .then((server) => {
        this.server = server;
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_mfa_error', {
            error: error.message,
          }),
        );

        this.$scope.resetAction();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  create() {
    return this.exchangeAccount.createMfa(
      this.exchangeService.domain,
      this.account.primaryEmailAddress,
    );
  }

  delete() {
    return this.exchangeAccount.deleteMfa(
      this.exchangeService.domain,
      this.account.primaryEmailAddress,
    );
  }

  disable() {
    return this.exchangeAccount.disableMfa(
      this.exchangeService.domain,
      this.account.primaryEmailAddress,
      this.disablePeriod,
    );
  }

  enable() {
    return this.exchangeAccount.enableMfa(
      this.exchangeService.domain,
      this.account.primaryEmailAddress,
    );
  }

  reset() {
    return this.exchangeAccount.resetMfa(
      this.exchangeService.domain,
      this.account.primaryEmailAddress,
    );
  }

  submit() {
    this.isLoading = true;

    let accountMfaPromise = null;
    let messages = {};
    switch (this.action) {
      case 'DELETE':
        accountMfaPromise = this.delete();
        messages = {
          success: 'exchange_delete_mfa_success',
          error: 'exchange_delete_mfa_error',
        };
        break;
      case 'DISABLE':
        accountMfaPromise = this.disable();
        messages = {
          success: 'exchange_disable_mfa_success',
          error: 'exchange_disable_mfa_error',
        };
        break;
      case 'ENABLE':
        accountMfaPromise =
          this.account.mfa.status === 'NOT_CREATED'
            ? this.create()
            : this.enable();
        messages = {
          success: 'exchange_enable_mfa_success',
          error: 'exchange_enable_mfa_error',
        };
        break;
      case 'RESET':
        accountMfaPromise = this.reset();
        messages = {
          success: 'exchange_reset_mfa_success',
          error: 'exchange_reset_mfa_error',
        };
        break;
      default:
        this.$scope.resetAction();
    }

    return accountMfaPromise
      .then(() => {
        this.messaging.writeSuccess(this.$translate.instant(messages.success));
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(messages.error, {
            error: error.message,
          }),
        );
      })
      .finally(() => this.$scope.resetAction());
  }
}
