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
    $translate,
    exchangeServiceInfrastructure,
    exchangeAccountTypes,
    wucExchange,
    wucExchangePassword,
    messaging,
    navigation,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
    this.exchangeAccountTypes = exchangeAccountTypes;
    this.wucExchange = wucExchange;
    this.wucExchangePassword = wucExchangePassword;
    this.messaging = messaging;
    this.navigation = navigation;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.originalValues = angular.copy(this.emailAccount);

    this.telephonyModel = {
      phone: { selected: '', number: '' },
      mobile: { selected: '', number: '' },
      fax: { selected: '', number: '' },
    };
    this.selectedAccount = angular.copy(this.emailAccount);
    this.selectedAccount.oldOutlook = this.selectedAccount.outlook;
    this.selectedAccount.oldDeleteOutlook = this.selectedAccount.deleteOutlook;
    this.selectedAccount.quota = this.selectedAccount.quota
      ? this.selectedAccount.quota
      : this.selectedAccount.totalQuota.value;

    this.passwordTooltip = null; // set in $scope.loadAccountOptions()

    this.exchange = this.wucExchange.value;

    this.isFetchingUpdateOptions = true;
    return this.loadAccountOptions()
      .then(() => {
        this.needsUpdate();
        this.updateExchangeAccount();
        this.initFields();
      })
      .then(() =>
        this.wucExchange
          .getSharepointService(this.exchange)
          .then((sharepoint) => {
            this.sharepoint = sharepoint;
          }),
      )
      .finally(() => {
        this.isFetchingUpdateOptions = false;
      });
  }

  initFields() {
    this.selectedAccount.countryCode =
      this.countries.find(
        ({ code }) => code === this.selectedAccount.countryCode,
      ) || null;
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
      initial:
        modifiedBuffer.initial !== originalValues.initial
          ? modifiedBuffer.initial
          : undefined,
      description:
        modifiedBuffer.description !== originalValues.description
          ? modifiedBuffer.description
          : undefined,
      forwardingEmail:
        modifiedBuffer.forwardingEmail !== originalValues.forwardingEmail
          ? modifiedBuffer.forwardingEmail
          : undefined,
      storeCopyOfEmail:
        modifiedBuffer.storeCopyOfEmail !== originalValues.storeCopyOfEmail
          ? modifiedBuffer.storeCopyOfEmail
          : undefined,
      jobDepartment:
        modifiedBuffer.jobDepartment !== originalValues.jobDepartment
          ? modifiedBuffer.jobDepartment
          : undefined,
      jobTitle:
        modifiedBuffer.jobTitle !== originalValues.jobTitle
          ? modifiedBuffer.jobTitle
          : undefined,
      office:
        modifiedBuffer.office !== originalValues.office
          ? modifiedBuffer.office
          : undefined,
      streetAddress:
        modifiedBuffer.streetAddress !== originalValues.streetAddress
          ? modifiedBuffer.streetAddress
          : undefined,
      postalCode:
        modifiedBuffer.postalCode !== originalValues.postalCode
          ? modifiedBuffer.postalCode
          : undefined,
      city:
        modifiedBuffer.city !== originalValues.city
          ? modifiedBuffer.city
          : undefined,
      countryCode:
        modifiedBuffer.countryCode?.code !== originalValues.countryCode?.code
          ? modifiedBuffer.countryCode.code
          : undefined,
      region:
        modifiedBuffer.region !== originalValues.region
          ? modifiedBuffer.region
          : undefined,
      phone:
        modifiedBuffer.phone !== originalValues.phone
          ? modifiedBuffer.phone
          : undefined,
      mobile:
        modifiedBuffer.mobile !== originalValues.mobile
          ? modifiedBuffer.mobile
          : undefined,
      fax:
        modifiedBuffer.fax !== originalValues.fax
          ? modifiedBuffer.fax
          : undefined,
    };

    return model;
  }

  getFeaturesToUpdate(originalValues, modifiedBuffer) {
    const model = this.getModelToUpdate(originalValues, modifiedBuffer);

    if (this.exchangeServiceInfrastructure.isProvider()) {
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
        updateAccountMessages.OK = this.$translate.instant(
          'exchange_ACTION_update_account_success_message',
        );
      } else if (messages[0].type === 'ERROR') {
        updateAccountMessages.ERROR = this.$translate.instant(
          'exchange_ACTION_update_account_error_message',
        );
      }
    } else if (messages.length === 2) {
      if (messages[0].type === messages[1].type) {
        if (messages[0].type === 'INFO') {
          updateAccountMessages.OK = this.$translate.instant(
            'exchange_ACTION_update_account_success_message',
          );
        } else if (messages[0].type === 'ERROR') {
          updateAccountMessages.ERROR = this.$translate.instant(
            'exchange_ACTION_update_account_error_message',
          );
        }
      } else if (messages[0].message === this.wucExchange.updateAccountAction) {
        updateAccountMessages.PARTIAL = `${this.$translate.instant(
          'exchange_ACTION_update_account_success_message',
        )} ${this.$translate.instant(
          'exchange_ACTION_change_password_account_error_message_linked',
        )}`;
      } else {
        updateAccountMessages.PARTIAL = `${this.$translate.instant(
          'exchange_ACTION_change_password_account_success_message',
        )} ${this.$translate.instant(
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
      this.simplePasswordFlag = !this.wucExchangePassword.passwordSimpleCheck(
        selectedAccount.password,
        true,
        this.updateAccountOptions.minPasswordLength,
      );

      // see the password complexity requirements of Microsoft Windows Server (like wucExchange)
      // https://technet.microsoft.com/en-us/library/hh994562%28v=ws.10%29.aspx
      if (this.updateAccountOptions.passwordComplexityEnabled) {
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
            this.containsSamAccountNameLabel = this.$translate.instant(
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

  isFormFieldsChanged() {
    const modifiedBuffer = this.selectedAccount;

    return (
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
      this.originalValues.deleteOutlook !== modifiedBuffer.deleteOutlook ||
      this.originalValues.initial !== modifiedBuffer.initial ||
      this.originalValues.description !== modifiedBuffer.description ||
      this.originalValues.forwardingEmail !== modifiedBuffer.forwardingEmail ||
      this.originalValues.storeCopyOfEmail !==
        modifiedBuffer.storeCopyOfEmail ||
      this.originalValues.jobDepartment !== modifiedBuffer.jobDepartment ||
      this.originalValues.jobTitle !== modifiedBuffer.jobTitle ||
      this.originalValues.office !== modifiedBuffer.office ||
      this.originalValues.streetAddress !== modifiedBuffer.streetAddress ||
      this.originalValues.postalCode !== modifiedBuffer.postalCode ||
      this.originalValues.city !== modifiedBuffer.city ||
      this.originalValues.countryCode !== modifiedBuffer.countryCode ||
      this.originalValues.region !== modifiedBuffer.region ||
      this.originalValues.phone !== modifiedBuffer.phone ||
      this.originalValues.mobile !== modifiedBuffer.mobile ||
      this.originalValues.fax !== modifiedBuffer.fax
    );
  }

  needsUpdate() {
    return (
      this.isFormFieldsChanged() &&
      this.accountIsValid() &&
      !this.takenEmailError
    );
  }

  setQuotaAvailable() {
    this.updateAccountOptions.quotaArray = [];

    for (
      let i = this.updateAccountOptions.maxQuota;
      i >= this.updateAccountOptions.minQuota;
      i -= 1
    ) {
      this.updateAccountOptions.quotaArray.push(i);
    }
  }

  canChangePrimary() {
    return this.updateAccountOptions != null;
  }

  getPasswordPlaceholder() {
    return this.selectedAccount.canBeConfigured
      ? this.$translate.instant(
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
      this.updateAccountOptions.availableDomains,
      (value) => value.name === domainName,
    );

    // if the current domain is not in the domain's list (dummy account),
    // select by default the first available
    if (result == null) {
      return this.updateAccountOptions.availableDomains[0];
    }

    return result;
  }

  loadAccountOptions() {
    this.noDomainMessage = null;
    return this.wucExchange
      .fetchingAccountCreationOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((data) => {
        this.updateAccountOptions = data;

        this.setQuotaAvailable();
        this.takenEmails = data.takenEmails;

        if (isEmpty(data.availableDomains)) {
          this.messaging.writeError(
            this.$translate.instant('exchange_ACTION_add_no_domains'),
          );
          this.navigation.resetAction();
          this.noDomainMessage = this.$translate.instant(
            'exchange_ACTION_add_no_domains',
          );

          this.error = true;
        } else {
          this.accountIsValid();
          this.selectedAccount.completeDomain = this.getCompleteDomain(
            this.selectedAccount.completeDomain.name,
          );
        }

        this.passwordTooltip = this.updateAccountOptions
          .passwordComplexityEnabled
          ? this.$translate.instant(
              'exchange_ACTION_update_account_step1_complex_password_tooltip',
              { t0: this.updateAccountOptions.minPasswordLength },
            )
          : this.$translate.instant(
              'exchange_ACTION_update_account_step1_simple_password_tooltip',
              { t0: this.updateAccountOptions.minPasswordLength },
            );
      })
      .catch((failure) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_ACTION_add_account_option_fail'),
          failure,
        );
        this.navigation.resetAction();
      });
  }

  updateExchangeAccount() {
    if (this.needsUpdate()) {
      this.wucExchange
        .updateAccount(
          this.$routerParams.organization,
          this.$routerParams.productId,
          this.getFeaturesToUpdate(this.originalValues, this.selectedAccount),
        )
        .then((data) => {
          this.messaging.setMessage(this.getActionMessage(data.messages), data);
        })
        .then(() => this.goBack())
        .catch((failure) => {
          this.messaging.writeError(`
            ${this.$translate.instant('exchange_common_error')} ${get(
            failure,
            'message',
            failure,
          )}
          `);
        });
    }
  }

  onCountryPhoneCodeChange(type) {
    this.selectedAccount[type] = this.telephonyModel[type].number;
  }
}
