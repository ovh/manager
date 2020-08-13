import assign from 'lodash/assign';
import find from 'lodash/find';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import map from 'lodash/map';

export default class ExchangeAccountAddController {
  /* @ngInject */
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
      return map(accountTypes, (accountType) => ({
        name: accountType,
        displayName: this.exchangeAccountTypes.getDisplayValue(accountType),
      }));
    }

    return this.Exchange.fetchingAccountCreationOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((accountCreationOptions) => {
        this.accountCreationOptions = assign(accountCreationOptions, {
          availableTypes: transformAccountTypes.call(
            this,
            accountCreationOptions.availableTypes,
          ),
        });

        this.newAccount.accountType = head(
          this.accountCreationOptions.availableTypes,
        );
        this.newAccount.domain = head(
          this.accountCreationOptions.availableDomains,
        );
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
    const emailAddressIsAlreadyTaken = !isEmpty(
      find(
        this.accountCreationOptions.takenEmails,
        (emailAddress) =>
          emailAddress ===
          `${this.newAccount.login}@${this.newAccount.domain.name}`,
      ),
    );

    this.newAccountForm.login.$setValidity(
      'emailAddressIsAlreadyTaken',
      !emailAddressIsAlreadyTaken,
    );
  }

  checkPasswordValidity() {
    if (this.newAccountForm.password.$error.required) {
      this.newAccountForm.password.$setValidity(
        'doesntRespectComplexityRules',
        true,
      );
      this.newAccountForm.password.$setValidity('containsDisplayName', true);
      this.newAccountForm.password.$setValidity('isSameAsSAMAccountName', true);
      return;
    }

    if (this.accountCreationOptions.passwordComplexityEnabled) {
      this.newAccountForm.password.$setValidity(
        'doesntRespectComplexityRules',
        this.ExchangePassword.passwordComplexityCheck(
          this.newAccount.password,
        ) &&
          this.ExchangePassword.passwordSimpleCheck(
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
        isEmpty(this.newAccount.samAccountName) ||
          (isString(this.newAccount.password) &&
            isString(this.newAccount.samAccountName) &&
            this.newAccount.password.toUpperCase() !==
              this.newAccount.samAccountName.toUpperCase()),
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
    this.goToAccounts();
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
      this.newAccountForm.passwordConfirmation.$setValidity(
        'isDifferentToPassword',
        true,
      );
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
