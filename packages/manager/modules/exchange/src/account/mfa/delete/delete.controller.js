export default class ExchangeAccountsMfaDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    wucExchange,
    exchangeAccount,
    messaging,
    navigation,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.exchangeAccount = exchangeAccount;
    this.exchangeService = wucExchange.value;
    this.messaging = messaging;
    this.navigation = navigation;
  }

  cancel() {
    this.navigation.resetAction();
  }

  submit() {
    this.isLoading = true;

    return this.exchangeAccount
      .deleteMfaOnAllAccounts(this.exchangeService.domain)
      .then(() => {
        this.messaging.writeSuccess(
          this.$translate.instant('exchange_account_mfa_delete_success'),
        );
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_account_mfa_delete_error', {
            errorMessage: error.message,
          }),
        );
      })
      .finally(() => this.navigation.resetAction());
  }
}
