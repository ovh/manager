import angular from 'angular';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import some from 'lodash/some';

export default class ExchangeUpdateAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    exchangeAccountOutlook,
    exchangeAccountTypes,
    exchangeServiceInfrastructure,
    Exchange,
    ExchangePassword,
    exchangeVersion,
    messaging,
    navigation,
    $translate,
  ) {
    this.services = {
      $scope,
      exchangeAccountOutlook,
      exchangeAccountTypes,
      exchangeServiceInfrastructure,
      Exchange,
      ExchangePassword,
      exchangeVersion,
      messaging,
      navigation,
      $translate,
    };

    this.$routerParams = Exchange.getParams();
    this.originalValues = angular.copy(navigation.currentActionData);

    $scope.needsUpdate = () => this.needsUpdate();
    $scope.loadAccountOptions = () => this.loadAccountOptions();
    $scope.updateExchangeAccount = () => this.updateExchangeAccount();

    this.selectedAccount = angular.copy(navigation.currentActionData);
    this.selectedAccount.oldOutlook = this.selectedAccount.outlook;
    this.selectedAccount.oldDeleteOutlook = this.selectedAccount.deleteOutlook;
    this.selectedAccount.quota = this.selectedAccount.quota
      ? this.selectedAccount.quota
      : this.selectedAccount.totalQuota.value;

    this.passwordTooltip = null; // set in $scope.loadAccountOptions()

    this.exchange = Exchange.value;

    Exchange.getSharepointService(this.exchange).then((sharepoint) => {
      this.sharepoint = sharepoint;
    });

    this.newAccountOptions = {
      availableDomains: [this.selectedAccount.domain],
      availableTypes: [this.selectedAccount.accountLicense],
      quotaArray: [],
    };
  }

  accountIsValid() {
    if (
      this.simplePasswordFlag ||
      this.differentPasswordFlag ||
      this.containsNameFlag ||
      this.containsWhitespaces
    ) {
      return false;
    }
    if (
      !this.selectedAccount.canBeConfigured &&
      !this.selectedAccount.password
    ) {
      return false;
    }
    if (!this.selectedAccount.domain || !this.selectedAccount.login) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  getModelToUpdate(originalValues, modifiedBuffer) {
    const model = {
      primaryEmailAddress: originalValues.primaryEmailAddress,
      login:
        modifiedBuffer.login !== originalValues.login
          ? modifiedBuffer.login
          : undefined,
      displayName:
        modifiedBuffer.displayName !== originalValues.displayName
          ? modifiedBuffer.displayName
          : undefined,
      domain:
        modifiedBuffer.completeDomain.name !==
        originalValues.completeDomain.name
          ? modifiedBuffer.completeDomain.name
          : undefined,
      firstName:
        modifiedBuffer.firstName !== originalValues.firstName
          ? modifiedBuffer.firstName
          : undefined,
      lastName:
        modifiedBuffer.lastName !== originalValues.lastName
          ? modifiedBuffer.lastName
          : undefined,
      hiddenFromGAL:
        modifiedBuffer.hiddenFromGAL !== originalValues.hiddenFromGAL
          ? modifiedBuffer.hiddenFromGAL
          : undefined,
      outlook:
        modifiedBuffer.outlook !== originalValues.outlook
          ? modifiedBuffer.outlook
          : undefined,
      company:
        modifiedBuffer.company !== originalValues.company
          ? modifiedBuffer.company
          : undefined,
      deleteOutlook:
        modifiedBuffer.deleteOutlook !== originalValues.deleteOutlook
          ? modifiedBuffer.deleteOutlook
          : undefined,
      accountLicense:
        modifiedBuffer.accountLicense !== originalValues.accountLicense
          ? modifiedBuffer.accountLicense
          : undefined,
    };

    return model;
  }

  getFeaturesToUpdate(originalValues, modifiedBuffer) {
    const model = this.getModelToUpdate(originalValues, modifiedBuffer);

    if (this.services.exchangeServiceInfrastructure.isProvider()) {
      model.quota =
        originalValues.totalQuota.value &&
        modifiedBuffer.quota !== originalValues.quota
          ? modifiedBuffer.quota
          : undefined;
    }

    model.password = modifiedBuffer.password;

    return model;
  }

  getActionMessage(messages) {
    const updateAccountMessages = {
      OK: ' ',
      PARTIAL: ' ',
      ERROR: ' ',
    };

    if (messages.length === 1) {
      if (messages[0].type === 'INFO') {
        updateAccountMessages.OK = this.services.$translate.instant(
          'exchange_ACTION_update_account_success_message',
        );
      } else if (messages[0].type === 'ERROR') {
        updateAccountMessages.ERROR = this.services.$translate.instant(
          'exchange_ACTION_update_account_error_message',
        );
      }
    } else if (messages.length === 2) {
      if (messages[0].type === messages[1].type) {
        if (messages[0].type === 'INFO') {
          updateAccountMessages.OK = this.services.$translate.instant(
            'exchange_ACTION_update_account_success_message',
          );
        } else if (messages[0].type === 'ERROR') {
          updateAccountMessages.ERROR = this.services.$translate.instant(
            'exchange_ACTION_update_account_error_message',
          );
        }
      } else if (
        messages[0].message === this.services.Exchange.updateAccountAction
      ) {
        updateAccountMessages.PARTIAL = `${this.services.$translate.instant(
          'exchange_ACTION_update_account_success_message',
        )} ${this.services.$translate.instant(
          'exchange_ACTION_change_password_account_error_message_linked',
        )}`;
      } else {
        updateAccountMessages.PARTIAL = `${this.services.$translate.instant(
          'exchange_ACTION_change_password_account_success_message',
        )} ${this.services.$translate.instant(
          'exchange_ACTION_update_account_error_message_linked',
        )}`;
      }
    }

    return updateAccountMessages;
  }

  checkTakenEmails() {
    this.takenEmailError = false;

    if (
      has(this.selectedAccount, 'login') &&
      !isEmpty(this.selectedAccount.login)
    ) {
      const currentEmail = `${this.selectedAccount.login.toLowerCase()}@${
        this.selectedAccount.completeDomain.name
      }`;
      this.takenEmailError = some(
        this.takenEmails,
        (value) => currentEmail === value.toLowerCase(),
      );

      if (this.selectedAccount.primaryEmailAddress === currentEmail) {
        this.takenEmailError = false;
      }
    }
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

    if (!isEmpty(selectedAccount.password)) {
      this.simplePasswordFlag = !this.services.ExchangePassword.passwordSimpleCheck(
        selectedAccount.password,
        true,
        this.newAccountOptions.minPasswordLength,
      );

      // see the password complexity requirements of Microsoft Windows Server (like Exchange)
      // https://technet.microsoft.com/en-us/library/hh994562%28v=ws.10%29.aspx
      if (this.newAccountOptions.passwordComplexityEnabled) {
        this.simplePasswordFlag =
          this.simplePasswordFlag ||
          !this.services.ExchangePassword.passwordComplexityCheck(
            selectedAccount.password,
          );

        if (selectedAccount.displayName) {
          this.containsNameFlag = this.services.ExchangePassword.passwordContainsName(
            selectedAccount.password,
            selectedAccount.displayName,
          );
        }

        if (
          !this.containsNameFlag &&
          selectedAccount.login &&
          includes(selectedAccount.password, selectedAccount.login)
        ) {
          this.containsNameFlag = true;
        }

        if (
          selectedAccount.samaccountName &&
          includes(selectedAccount.password, selectedAccount.samaccountName)
        ) {
          if (!this.containsSamAccountNameLabel) {
            this.containsSamAccountNameLabel = this.services.$translate.instant(
              'exchange_ACTION_update_account_step1_password_contains_samaccount_name',
              { t0: selectedAccount.samaccountName },
            );
          }

          this.containsSamAccountNameFlag = true;
        } else {
          this.containsSamAccountNameFlag = false;
        }

        this.containsWhitespaces = /\s/.test(this.selectedAccount.password);
      }
    }
  }

  needsUpdate() {
    const modifiedBuffer = this.selectedAccount;

    const needsUpdate =
      modifiedBuffer.password != null ||
      this.originalValues.login !== modifiedBuffer.login ||
      this.originalValues.displayName !== modifiedBuffer.displayName ||
      (modifiedBuffer.completeDomain != null &&
        this.originalValues.completeDomain.name !==
          modifiedBuffer.completeDomain.name) ||
      this.originalValues.firstName !== modifiedBuffer.firstName ||
      this.originalValues.lastName !== modifiedBuffer.lastName ||
      this.originalValues.hiddenFromGAL !== modifiedBuffer.hiddenFromGAL ||
      this.originalValues.company !== modifiedBuffer.company ||
      this.originalValues.accountLicense !== modifiedBuffer.accountLicense ||
      this.originalValues.quota !== modifiedBuffer.quota ||
      this.originalValues.outlook !== modifiedBuffer.outlook ||
      this.originalValues.deleteOutlook !== modifiedBuffer.deleteOutlook;

    return needsUpdate && this.accountIsValid() && !this.takenEmailError;
  }

  setQuotaAvailable() {
    this.newAccountOptions.quotaArray = [];

    for (
      let i = this.newAccountOptions.maxQuota;
      i >= this.newAccountOptions.minQuota;
      i -= 1
    ) {
      this.newAccountOptions.quotaArray.push(i);
    }
  }

  canChangePrimary() {
    return this.newAccountOptions != null;
  }

  getPasswordPlaceholder() {
    return this.selectedAccount.canBeConfigured
      ? this.services.$translate.instant(
          'exchange_ACTION_update_account_step1_password_placeholder',
        )
      : ' ';
  }

  shouldDisplaySharepointPasswordWarning() {
    const isChangingPassword =
      this.selectedAccount.password != null &&
      this.selectedAccount.canBeConfigured;
    const hasSharepoint = this.sharepoint != null;

    return isChangingPassword && hasSharepoint;
  }

  getCompleteDomain(domainName) {
    const result = find(
      this.newAccountOptions.availableDomains,
      (value) => value.name === domainName,
    );

    // if the current domain is not in the domain's list (dummy account),
    // select by default the first available
    if (result == null) {
      return this.newAccountOptions.availableDomains[0];
    }

    return result;
  }

  loadAccountOptions() {
    this.noDomainMessage = null;
    this.services.Exchange.fetchingAccountCreationOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((data) => {
        this.newAccountOptions = data;

        this.setQuotaAvailable();
        this.takenEmails = data.takenEmails;

        if (isEmpty(data.availableDomains)) {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_ACTION_add_no_domains'),
          );
          this.services.navigation.resetAction();
          this.noDomainMessage = this.services.$translate.instant(
            'exchange_ACTION_add_no_domains',
          );

          this.error = true;
        } else {
          this.accountIsValid();
          this.selectedAccount.completeDomain = this.getCompleteDomain(
            this.selectedAccount.completeDomain.name,
          );
        }

        this.passwordTooltip = this.newAccountOptions.passwordComplexityEnabled
          ? this.services.$translate.instant(
              'exchange_ACTION_update_account_step1_complex_password_tooltip',
              { t0: this.newAccountOptions.minPasswordLength },
            )
          : this.services.$translate.instant(
              'exchange_ACTION_update_account_step1_simple_password_tooltip',
              { t0: this.newAccountOptions.minPasswordLength },
            );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_account_option_fail',
          ),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  updateExchangeAccount() {
    if (this.needsUpdate()) {
      this.services.Exchange.updateAccount(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.getFeaturesToUpdate(this.originalValues, this.selectedAccount),
      )
        .then((data) => {
          this.services.messaging.setMessage(
            this.getActionMessage(data.messages),
            data,
          );
        })
        .catch((failure) => {
          this.services.messaging.writeError(`
            ${this.services.$translate.instant('exchange_common_error')} ${get(
            failure,
            'message',
            failure,
          )}
          `);
        })
        .finally(() => {
          this.services.navigation.resetAction();
        });
    }
  }
}
