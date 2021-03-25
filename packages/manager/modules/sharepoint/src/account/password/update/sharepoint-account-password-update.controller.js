import set from 'lodash/set';
import some from 'lodash/some';

export default class SharepointUpdatePasswordCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    wucExchangePassword,
    MicrosoftSharepointLicenseService,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.wucExchangePassword = wucExchangePassword;
    this.microsoftSharepointLicense = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.account = this.$scope.currentActionData;
    this.exchangeId = this.$stateParams.exchangeId;
    this.passwordTooltip = null;

    this.retrievingMSService();

    this.microsoftSharepointLicense
      .getAssociatedExchangeService(this.exchangeId)
      .then(() => {
        this.hasAssociatedExchange = true;
      });

    this.$scope.updatingSharepointPassword = () =>
      this.updatingSharepointPassword();
  }

  updatingSharepointPassword() {
    return this.microsoftSharepointLicense
      .updatingSharepointPasswordAccount(
        this.exchangeId,
        this.account.userPrincipalName,
        {
          password: this.account.password,
        },
      )
      .then(() =>
        this.alerter.success(
          this.$translate.instant(
            'sharepoint_ACTION_update_password_confirm_message_text',
            { t0: this.account.userPrincipalName },
          ),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.alerter.alertFromSWS(
          this.$translate.instant(
            'sharepoint_ACTION_update_password_error_message_text',
          ),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.$scope.resetAction();
      });
  }

  retrievingMSService() {
    return this.microsoftSharepointLicense
      .retrievingMSService(this.exchangeId)
      .then((exchange) => {
        this.exchange = exchange;
        this.setPasswordTooltipMessage();
      });
  }

  setPasswordTooltipMessage() {
    const messageId = this.exchange.complexityEnabled
      ? 'sharepoint_ACTION_update_password_complexity_message_all'
      : 'sharepoint_ACTION_update_password_complexity_message_length';
    this.passwordTooltip = this.$translate.instant(messageId, {
      t0: this.exchange.minPasswordLength,
    });
  }

  setPasswordsFlag(selectedAccount) {
    this.differentPasswordFlag = false;
    this.simplePasswordFlag = false;
    this.containsNameFlag = false;
    this.containsSameAccountNameFlag = false;

    set(selectedAccount, 'password', selectedAccount.password || '');
    set(
      selectedAccount,
      'passwordConfirmation',
      selectedAccount.passwordConfirmation || '',
    );

    if (selectedAccount.password !== selectedAccount.passwordConfirmation) {
      this.differentPasswordFlag = true;
    }

    if (selectedAccount.password.length > 0) {
      this.simplePasswordFlag = !this.wucExchangePassword.passwordSimpleCheck(
        selectedAccount.password,
        true,
        this.exchange.minPasswordLength,
      );

      // see the password complexity requirements of Windows Server (like wucExchange)
      // https://technet.microsoft.com/en-us/library/hh994562%28v=ws.10%29.aspx
      if (this.exchange.complexityEnabled) {
        this.simplePasswordFlag =
          this.simplePasswordFlag ||
          !this.wucExchangePassword.passwordComplexityCheck(
            selectedAccount.password,
          );

        if (selectedAccount.displayName) {
          this.containsNameFlag = this.wucExchangePassword.passwordContainsName(
            selectedAccount.password,
            selectedAccount.displayName,
          );
        }

        if (!this.containsNameFlag && selectedAccount.login) {
          if (some(selectedAccount.password, selectedAccount.login)) {
            this.containsNameFlag = true;
          }
        }

        if (
          selectedAccount.samaccountName &&
          some(selectedAccount.password, selectedAccount.samaccountName)
        ) {
          if (!this.containsSamAccountNameLabel) {
            this.containsSamAccountNameLabel = this.$translate.instant(
              'exchange_ACTION_update_account_step1_password_contains_samaccount_name',
              { t0: selectedAccount.samaccountName },
            );
          }

          this.containsSamAccountNameFlag = true;
        } else {
          this.containsSamAccountNameFlag = false;
        }
      }
    }
  }
}
