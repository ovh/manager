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
    $translate,
    exchangeAccountTypes,
    wucExchange,
    exchangeAccount,
    exchangeServiceInfrastructure,
    wucExchangePassword,
    exchangeVersion,
    messaging,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;

    this.exchangeAccountTypes = exchangeAccountTypes;
    this.wucExchange = wucExchange;
    this.exchangeAccount = exchangeAccount;
    this.wucExchangePassword = wucExchangePassword;
    this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
    this.exchangeVersion = exchangeVersion;
    this.messaging = messaging;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();

    this.isFetchingCreationOptions = true;
    this.telephonyModel = {
      phone: { selected: '', number: '' },
      mobile: { selected: '', number: '' },
      fax: { selected: '', number: '' },
    };
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

    return this.wucExchange
      .fetchingAccountCreationOptions(
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
        this.wucExchangePassword.passwordComplexityCheck(
          this.newAccount.password,
        ) &&
          this.wucExchangePassword.passwordSimpleCheck(
            this.newAccount.password,
            true,
            this.accountCreationOptions.minPasswordLength,
          ),
      );
      this.newAccountForm.password.$setValidity(
        'containsDisplayName',
        !this.wucExchangePassword.passwordContainsName(
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
        this.wucExchangePassword.passwordSimpleCheck(
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

  sendingNewAccount() {
    this.isSendingNewAccount = true;

    const formattedAccount = {
      SAMAccountName: this.newAccount.samAccountName,
      login: this.newAccount.login,
      domain: this.newAccount.domain.name,
      firstName: this.newAccount.firstName,
      lastName: this.newAccount.lastName,
      displayName: this.newAccount.displayName,
      initials: this.newAccount.initials,
      description: this.newAccount.description,
      forwardingEmail: this.newAccount.forwardingEmail,
      storeCopyOfEmail: this.newAccount.storeCopyOfEmail,
      password: this.newAccount.password,
      company: this.newAccount.company,
      jobDepartment: this.newAccount.jobDepartment,
      jobTitle: this.newAccount.jobTitle,
      office: this.newAccount.office,
      postalCode: this.newAccount.postalCode,
      city: this.newAccount.city,
      ...(this.newAccount.countryCode && {
        countryCode: this.newAccount.countryCode.code,
      }),
      region: this.newAccount.region,
      phone: this.newAccount.phone,
      mobile: this.newAccount.mobile,
      fax: this.newAccount.fax,
      license: this.newAccount.accountType.name.toLowerCase(),
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
          this.$translate.instant('exchange_ACTION_add_account_error_message', {
            message: error.message || error.data?.message,
          }),
          error,
        );
      })
      .finally(() => {
        this.hide();
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

  onCountryPhoneCodeChange(type) {
    this.newAccount[type] = this.telephonyModel[type].number;
  }
}
