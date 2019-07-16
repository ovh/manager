angular.module('Module.emailpro.controllers').controller(
  'EmailProUpdateAccountCtrl',
  class EmailProUpdateAccountCtrl {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      EmailPro,
      EmailProPassword,
      WucConverterService,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.exchange = this.$scope.exchange;

      this.EmailPro = EmailPro;
      this.EmailProPassword = EmailProPassword;
      this.WucConverterService = WucConverterService;

      this.mxPlan = {};
      this.originalValues = angular.copy(this.$scope.currentActionData);

      this.selectedAccount = this.$scope.currentActionData;
      this.selectedAccount.quota = this.$scope.currentActionData.quota
        ? this.$scope.currentActionData.quota : this.selectedAccount.totalQuota.value;

      this.passwordTooltip = null; // set in this.loadAccountOptions()
      this.newAccountOptions = {
        availableDomains: [this.selectedAccount.domain],
        availableTypes: [this.selectedAccount.accountLicense],
        quotaArray: [],
      };
      this.accountTypeProvider = this.EmailPro.accountTypeProvider;
      this.accountTypeDedicated = this.EmailPro.accountTypeDedicated;
      this.accountTypeHosted = this.EmailPro.accountTypeHosted;
      this.$scope.updateExchangeAccount = () => this.updateExchangeAccount();
    }

    accountIsValid() {
      const account = this.selectedAccount;
      if (this.simplePasswordFlag
        || this.differentPasswordFlag
        || this.containsNameFlag) {
        return false;
      } if (account && /\s/.test(account.password)) {
        return false;
      } if (!account.canBeConfigured && !account.password) {
        return false;
      } if (!account.domain || !account.login) {
        return false;
      }
      return true;
    }

    isMxPlan() {
      return this.exchange.isMXPlan;
    }

    getModelToUpdate(originalValues, modifiedBuffer) {
      const model = { primaryEmailAddress: originalValues.primaryEmailAddress };
      model.login = modifiedBuffer.login !== originalValues.login
        ? modifiedBuffer.login : originalValues.login;
      model.displayName = modifiedBuffer.displayName !== originalValues.displayName
        ? modifiedBuffer.displayName : undefined;
      model.domain = modifiedBuffer.completeDomain.name !== originalValues.completeDomain.name
        ? modifiedBuffer.completeDomain.name : originalValues.completeDomain.name;
      model.firstName = modifiedBuffer.firstName !== originalValues.firstName
        ? modifiedBuffer.firstName : undefined;
      model.lastName = modifiedBuffer.lastName !== originalValues.lastName
        ? modifiedBuffer.lastName : undefined;
      model.hiddenFromGAL = modifiedBuffer.hiddenFromGAL !== originalValues.hiddenFromGAL
        ? modifiedBuffer.hiddenFromGAL : undefined;
      model.accountLicense = modifiedBuffer.accountLicense !== originalValues.accountLicense
        ? modifiedBuffer.accountLicense : undefined;
      if (this.exchange.isMXPlan) {
        model.quota = modifiedBuffer.quota !== originalValues.quota
          ? modifiedBuffer.quota : undefined;
      }
      return model;
    }

    getFeaturesToUpdate(originalValues, modifiedBuffer) {
      const model = this.getModelToUpdate(originalValues, modifiedBuffer);

      if (this.exchange.offer === this.accountTypeProvider) {
        model.quota = originalValues.totalQuota.value
          && modifiedBuffer.quota !== originalValues.quota
          ? modifiedBuffer.quota : undefined;
      }
      model.password = modifiedBuffer.password;
      return model;
    }


    checkTakenEmails() {
      this.takenEmailError = false;

      if (this.takenEmails && this.selectedAccount.login) {
        angular.forEach(this.$scope.takenEmails, (value) => {
          if (`${this.selectedAccount.login.toLowerCase()}@${this.selectedAccount.completeDomain.name}` === value.toLowerCase()) {
            this.takenEmailError = true;
          }
        });
      }

      if (this.originalValues.primaryEmailAddress === `${this.selectedAccount.login}@${this.selectedAccount.completeDomain.name}`) {
        this.takenEmailError = false;
      }
    }

    setPasswordsFlag(selectedAccount) {
      this.differentPasswordFlag = false;
      this.simplePasswordFlag = false;
      this.containsNameFlag = false;
      this.containsSameAccountNameFlag = false;

      _.set(selectedAccount, 'password', selectedAccount.password || '');
      _.set(selectedAccount, 'passwordConfirmation', selectedAccount.passwordConfirmation || '');

      if (selectedAccount.password !== selectedAccount.passwordConfirmation) {
        this.differentPasswordFlag = true;
      }

      if (selectedAccount.password.length > 0) {
        this.simplePasswordFlag = !this.EmailProPassword.passwordSimpleCheck(
          selectedAccount.password,
          true,
          this.newAccountOptions.minPasswordLength,
        );

        /*
          see the password complexity requirements of Microsoft Windows Server (like EmailPro)
          https://technet.microsoft.com/en-us/library/hh994562%28v=ws.10%29.aspx
        */
        if (this.newAccountOptions.passwordComplexityEnabled) {
          this.simplePasswordFlag = this.simplePasswordFlag
            || !this.EmailProPassword.passwordComplexityCheck(selectedAccount.password);

          if (selectedAccount.displayName) {
            this.containsNameFlag = this.EmailProPassword.passwordContainsName(
              selectedAccount.password,
              selectedAccount.displayName,
            );
          }

          if (!this.containsNameFlag && selectedAccount.login) {
            if (selectedAccount.password.indexOf(selectedAccount.login) !== -1) {
              this.containsNameFlag = true;
            }
          }

          if (selectedAccount.samaccountName
            && selectedAccount.password.indexOf(selectedAccount.samaccountName) !== -1) {
            if (!this.containsSamAccountNameLabel) {
              this.containsSamAccountNameLabel = this.$translate.instant('emailpro_ACTION_update_account_step1_password_contains_samaccount_name',
                { t0: selectedAccount.samaccountName });
            }
            this.containsSamAccountNameFlag = true;
          } else {
            this.containsSamAccountNameFlag = false;
          }
        }
      }
    }

    needsUpdate() {
      const modifiedBuffer = this.selectedAccount;
      const result = !(!modifiedBuffer.password
        && angular.equals(this.originalValues.login, modifiedBuffer.login)
        && angular.equals(this.originalValues.displayName, modifiedBuffer.displayName)
        && angular.equals(
          this.originalValues.completeDomain.name,
          modifiedBuffer.completeDomain.name,
        )
        && angular.equals(this.originalValues.firstName, modifiedBuffer.firstName)
        && angular.equals(this.originalValues.lastName, modifiedBuffer.lastName)
        && angular.equals(this.originalValues.hiddenFromGAL, modifiedBuffer.hiddenFromGAL)
        && angular.equals(this.originalValues.accountLicense, modifiedBuffer.accountLicense)
        && angular.equals(this.originalValues.quota, modifiedBuffer.quota));
      return result && this.accountIsValid() && !this.takenEmailError;
    }

    setQuotaAvailable() {
      this.newAccountOptions.quotaArray = [];
      for (let i = this.newAccountOptions.maxQuota;
        i >= this.newAccountOptions.minQuota; i -= 1) {
        this.newAccountOptions.quotaArray.push(i);
      }
    }

    canChangePrimary() {
      if (this.selectedAccount.is25g) {
        return this.selectedAccount.primaryEmailAddress.split('@')[1] === 'configureme.me';
      }
      return this.newAccountOptions !== null;
    }

    getPasswordPlaceholder() {
      return this.selectedAccount.canBeConfigured ? this.$translate.instant('emailpro_ACTION_update_account_step1_password_placeholder') : ' ';
    }

    getCompleteDomain(domainName) {
      let result;
      angular.forEach(this.newAccountOptions.availableDomains, (value) => {
        if (value.name === domainName) {
          result = value;
        }
      });

      // if the current domain is not in the domain's list (dummy account)
      // select by default the first available
      if (result === undefined) {
        result = _.first(this.newAccountOptions.availableDomains);
      }
      return result;
    }

    loadAccountOptions() {
      this.noDomainMessage = null;
      if (this.isMxPlan()) {
        this.EmailPro.getCapabilities(
          this.$stateParams.productId,
          this.selectedAccount.primaryEmailAddress,
        ).then((result) => {
          this.mxPlan.quotaArray = result.quotas;
        });
      }
      this.EmailPro.getNewAccountOptions(this.$stateParams.productId).then((data) => {
        this.canDeleteOutlookAtExpiration = true;

        // No restrictions for Outlook suppression,
        this.newAccountOptions = data;
        this.setQuotaAvailable();
        this.takenEmails = data.takenEmails;

        if (data.availableDomains.length === 0) {
          this.setMessage(this.$translate.instant('emailpro_ACTION_add_no_domains'), { status: 'error' });
          this.resetAction();
          this.noDomainMessage = this.$translate.instant('emailpro_ACTION_add_no_domains');

          this.error = true;
          this.setMessage(this.$translate.instant('emailpro_ACTION_add_no_domains'));
        } else {
          this.accountIsValid();
          this.selectedAccount.completeDomain = this.getCompleteDomain(
            this.selectedAccount.completeDomain.name,
          );
        }

        this.passwordTooltip = this.newAccountOptions.passwordComplexityEnabled
          ? this.$translate.instant('emailpro_ACTION_update_account_step1_complex_password_tooltip',
            { t0: this.newAccountOptions.minPasswordLength })
          : this.$translate.instant('emailpro_ACTION_update_account_step1_simple_password_tooltip',
            { t0: this.newAccountOptions.minPasswordLength });
      }, (failure) => {
        this.setMessage(this.$translate.instant('emailpro_ACTION_add_account_option_fail'), failure.data);
        this.resetAction();
      });
    }

    updateExchangeAccount() {
      this.$scope.resetAction();
      this.$scope.setMessage(this.$translate.instant('emailpro_dashboard_action_doing'));

      if (this.needsUpdate()) {
        return this.EmailPro
          .updateAccount(
            this.$stateParams.productId,
            this.getFeaturesToUpdate(this.originalValues, this.selectedAccount),
          )
          .then(() => {
            this.$scope.setMessage(this.$translate.instant(`${this.exchange.billingPlan}_ACTION_update_account_success_message`), { type: 'success' });
          })
          .catch((failure) => {
            this.$scope.setMessage(this.$translate.instant(`${this.exchange.billingPlan}_ACTION_update_account_error_message`), failure);
          });
      }

      return this.$q.when();
    }

    convertBytesSize(nb, unit, decimalWanted = 0) {
      const res = window.filesize(this.WucConverterService.convertToOctet(nb, unit), {
        output: 'object',
        round: decimalWanted,
        base: -1,
      });
      const resUnit = this.$translate.instant(`unit_size_${res.symbol}`);
      return `${res.value} ${resUnit}`;
    }
  },
);
