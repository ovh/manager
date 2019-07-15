{
  class ExchangeAccountAddController {
    constructor(
      $scope,
      $timeout,
      exchangeAccountTypes,
      Exchange,
      exchangeAccount,
      exchangeServiceInfrastructure,
      ExchangePassword,
      exchangeVersion,
      messaging,
      $translate,
    ) {
      this.$scope = $scope;
      this.$timeout = $timeout;

      this.exchangeAccountTypes = exchangeAccountTypes;
      this.Exchange = Exchange;
      this.exchangeAccount = exchangeAccount;
      this.ExchangePassword = ExchangePassword;
      this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
      this.exchangeVersion = exchangeVersion;
      this.messaging = messaging;
      this.$translate = $translate;
    }

    $onInit() {
      this.$routerParams = this.Exchange.getParams();

      this.isFetchingCreationOptions = true;
      this.newAccount = {};
      this.shouldDisplayPasswordInput = true;
      this.isSendingNewAccount = false;

      return this.fetchingAccountCreationOptions();
    }

    fetchingAccountCreationOptions() {
      function transformAccountTypes(accountTypes) {
        return _(accountTypes)
          .map(accountType => ({
            name: accountType,
            displayName: this.exchangeAccountTypes.getDisplayValue(accountType),
          }))
          .value();
      }

      return this.Exchange
        .fetchingAccountCreationOptions(
          this.$routerParams.organization,
          this.$routerParams.productId,
        )
        .then((accountCreationOptions) => {
          this.accountCreationOptions = _(accountCreationOptions)
            .assign({
              availableTypes: transformAccountTypes.call(
                this,
                accountCreationOptions.availableTypes,
              ),
            })
            .value();

          this.newAccount.accountType = _.first(this.accountCreationOptions.availableTypes);
          this.newAccount.domain = _.first(this.accountCreationOptions.availableDomains);
        })
        .catch((error) => {
          this.messaging.writeError(
            this.$translate.instant(
              'exchange_ACTION_add_account_fetchingAccountCreationOptions_error',
            ),
            error,
          );
          this.hide();
        })
        .finally(() => {
          this.isFetchingCreationOptions = false;
        });
    }

    checkEmailAddressIsAlreadyTaken() {
      const emailAddressIsAlreadyTaken = !_(this.accountCreationOptions.takenEmails)
        .chain()
        .find(
          emailAddress => emailAddress === `${this.newAccount.login}@${this.newAccount.domain.name}`,
        )
        .isEmpty()
        .value();

      this.newAccountForm.login.$setValidity(
        'emailAddressIsAlreadyTaken',
        !emailAddressIsAlreadyTaken,
      );
    }

    checkPasswordValidity() {
      if (this.newAccountForm.password.$error.required) {
        this.newAccountForm.password.$setValidity('doesntRespectComplexityRules', true);
        this.newAccountForm.password.$setValidity('containsDisplayName', true);
        this.newAccountForm.password.$setValidity('isSameAsSAMAccountName', true);
        return;
      }

      if (this.accountCreationOptions.passwordComplexityEnabled) {
        this.newAccountForm.password.$setValidity(
          'doesntRespectComplexityRules',
          this.ExchangePassword.passwordComplexityCheck(
            this.newAccount.password,
            true,
            this.accountCreationOptions.minPasswordLength,
          ),
        );
        this.newAccountForm.password.$setValidity(
          'containsDisplayName',
          !this.ExchangePassword.passwordContainsName(
            this.newAccount.password,
            this.newAccount.displayName,
          ),
        );
        this.newAccountForm.password.$setValidity(
          'isSameAsSAMAccountName',
          _(this.newAccount.samAccountName).isEmpty()
            || (_(this.newAccount.password).isString()
              && _(this.newAccount.samAccountName).isString()
              && this.newAccount.password.toUpperCase()
                !== this.newAccount.samAccountName.toUpperCase()),
        );
      } else {
        this.newAccountForm.password.$setValidity(
          'doesntRespectComplexityRules',
          this.ExchangePassword.passwordSimpleCheck(
            this.newAccount.password,
            true,
            this.accountCreationOptions.minPasswordLength,
          ),
        );
      }
    }

    hide() {
      this.$scope.$emit(this.exchangeAccount.EVENTS.CHANGE_STATE, { stateName: 'hide' });
    }

    switchBetweenPasswordAndTextInput() {
      const touchednessStatus = this.newAccountForm.password.$touched;
      this.shouldDisplayPasswordInput = !this.shouldDisplayPasswordInput;
      this.$timeout(() => {
        if (touchednessStatus) {
          this.newAccountForm.password.$setTouched();
          // It is intentional if the touchness impacts the dirtyness
          this.newAccountForm.password.$setDirty();
        }

        this.checkPasswordValidity();
      });
    }

    onPasswordConfirmationChange() {
      if (this.newAccountForm.passwordConfirmation.$error.required) {
        this.newAccountForm.passwordConfirmation.$setValidity('isDifferentToPassword', true);
      } else {
        this.newAccountForm.passwordConfirmation.$setValidity(
          'isDifferentToPassword',
          this.newAccount.password === this.newAccount.passwordConfirmation,
        );
      }
    }

    sendingNewAccount() {
      this.isSendingNewAccount = true;

      const formattedAccount = {
        SAMAccountName: this.newAccount.samAccountName,
        company: this.newAccount.company,
        displayName: this.newAccount.displayName,
        domain: this.newAccount.domain.name,
        firstName: this.newAccount.firstName,
        lastName: this.newAccount.lastName,
        license: this.newAccount.accountType.name.toLowerCase(),
        login: this.newAccount.login,
        password: this.newAccount.password,
        spamAndVirusConfiguration: {
          checkDKIM: false,
          putInJunk: false,
          deleteSpam: false,
          tagSpam: false,
          checkSPF: false,
          tagVirus: false,
          deleteVirus: true,
        },
      };

      return this.exchangeAccount
        .sendingNewAccount(
          this.$routerParams.organization,
          this.$routerParams.productId,
          formattedAccount,
        )
        .then((data) => {
          this.messaging.writeSuccess(
            this.$translate.instant('exchange_account_add_submit_success', {
              t0: `${formattedAccount.login}@${formattedAccount.domain}`,
            }),
            data,
          );
        })
        .catch((error) => {
          this.messaging.writeError(
            this.$translate.instant('exchange_ACTION_add_account_error_message'),
            error,
          );
        })
        .finally(() => {
          this.hide();
        });
    }
  }

  angular.module('Module.exchange.components').component('exchangeAccountAdd', {
    templateUrl: 'exchange/account/add/account-add.html',
    controller: ExchangeAccountAddController,
  });
}
