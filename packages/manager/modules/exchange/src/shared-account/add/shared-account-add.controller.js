import angular from 'angular';
import has from 'lodash/has';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import values from 'lodash/values';

export default class ExchangeAddSharedAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    wucExchange,
    ExchangeSharedAccounts,
    formValidation,
    messaging,
    navigation,
  ) {
    this.services = {
      $scope,
      $translate,
      wucExchange,
      ExchangeSharedAccounts,
      formValidation,
      messaging,
      navigation,
    };

    this.$routerParams = wucExchange.getParams();

    this.errors = {
      emailIsAlreadyTaken: false,
      emailLocalPartIsEmpty: false,
      emailLocalPartDoesntRespectsPattern: false,
      quotaIsWrong: false,
    };

    this.accountBeingCreated = {
      hiddenFromGAL: false,
      mailingFilter: ['vaderetro'],
    };

    this.localPartValidationRegex = /^[-\w]+((\.|\+)[-\w]+)*$/;

    $scope.loadingCreationOptions = () => this.loadingCreationOptions();
    $scope.addingAccount = () => this.addingAccount();
    $scope.isAccountValid = () => this.isAccountValid();
  }

  hasEmailAccountFieldErrors() {
    this.errors.emailLocalPartIsEmpty = this.services.formValidation.doesFieldContainsErrors(
      this.sharedAccountForm,
      'localPart',
      'required',
    );
    this.errors.emailLocalPartDoesntRespectsPattern = this.services.formValidation.doesFieldContainsErrors(
      this.sharedAccountForm,
      'localPart',
      'pattern',
    );

    return (
      this.errors.emailLocalPartIsEmpty ||
      this.errors.emailLocalPartDoesntRespectsPattern ||
      this.errors.emailIsAlreadyTaken
    );
  }

  hasQuotaFieldErrors() {
    const quotaIsntANumber = this.services.formValidation.doesFieldContainsErrors(
      this.sharedAccountForm,
      'quota',
      'number',
    );
    this.errors.quotaIsWrong =
      quotaIsntANumber ||
      this.services.formValidation.doesFieldContainsErrors(
        this.sharedAccountForm,
        'quota',
        'min',
      ) ||
      this.services.formValidation.doesFieldContainsErrors(
        this.sharedAccountForm,
        'quota',
        'max',
      );

    return (
      this.errors.quotaIsWrong ||
      (this.sharedAccountForm.unit.$dirty &&
        !isEmpty(this.sharedAccountForm.quota.$error))
    );
  }

  buildDisplayName() {
    const firstName = this.accountBeingCreated.firstName || '';
    const separator =
      this.accountBeingCreated.firstName && this.accountBeingCreated.lastName
        ? ' '
        : '';
    const lastName = this.accountBeingCreated.lastName || '';

    this.accountBeingCreated.displayName = `${firstName}${separator}${lastName}`;
  }

  emailOnChange() {
    this.accountBeingCreated.sharedEmailAddress = `${this.localPart}@${this.domain.name}`.toLowerCase();
    this.errors.emailIsAlreadyTaken = false;
    const matchingEmaiAddress = this.alreadyTakenEmails.find(
      (alreadyTakenEmail) =>
        this.accountBeingCreated.sharedEmailAddress.toUpperCase() ===
        alreadyTakenEmail.toUpperCase(),
    );
    this.errors.emailIsAlreadyTaken = matchingEmaiAddress != null;
  }

  loadingCreationOptions() {
    return this.services.ExchangeSharedAccounts.retrievingNewSharedAccountOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    ).then((data) => {
      this.optionsToCreateNewAccounts = angular.copy(data);
      this.alreadyTakenEmails = data.takenEmails;

      if (isEmpty(data.availableDomains)) {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_add_no_domains'),
        );
        this.services.navigation.resetAction();
      } else if (
        this.optionsToCreateNewAccounts.maxQuota.value <
        this.optionsToCreateNewAccounts.minQuota.value
      ) {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_SHARED_ACCOUNTS_total_quota_error_message',
          ),
        );
        this.services.navigation.resetAction();
      } else {
        this.domain = head(data.availableDomains);
        const {
          value,
          unit,
        } = this.services.ExchangeSharedAccounts.formatQuota(
          this.optionsToCreateNewAccounts.maxQuota,
        );

        Object.assign(this.optionsToCreateNewAccounts, {
          quota: angular.copy(this.optionsToCreateNewAccounts.minQuota),
          availableQuotaUnits: this.services.ExchangeSharedAccounts.getQuotaUnitRange(
            this.optionsToCreateNewAccounts.minQuota.unit,
            unit,
          ),
          maxQuota: Object.assign(
            angular.copy(this.optionsToCreateNewAccounts.maxQuota),
            {
              toDisplay: { value, unit },
            },
          ),
        });

        this.accountBeingCreated.quota = this.optionsToCreateNewAccounts.quota.value;
        this.minQuota = this.optionsToCreateNewAccounts.minQuota.value;
        this.maxQuota = this.optionsToCreateNewAccounts.maxQuota.value;
      }
    });
  }

  isDirty() {
    return (
      has(this.sharedAccountForm, 'localPart.$dirty') &&
      this.sharedAccountForm.localPart.$dirty
    );
  }

  isAccountValid() {
    return this.isDirty() && !includes(values(this.errors), true);
  }

  convertQuotas() {
    this.selectQuota();

    this.minQuota = this.services.ExchangeSharedAccounts.convertQuota(
      this.optionsToCreateNewAccounts.minQuota.value,
      this.optionsToCreateNewAccounts.minQuota.unit,
      this.optionsToCreateNewAccounts.quota.unit,
    );

    this.maxQuota = this.services.ExchangeSharedAccounts.convertQuota(
      this.optionsToCreateNewAccounts.maxQuota.value,
      this.optionsToCreateNewAccounts.maxQuota.unit,
      this.optionsToCreateNewAccounts.quota.unit,
    );
  }

  selectQuota() {
    if (this.optionsToCreateNewAccounts.quota.value) {
      this.accountBeingCreated.quota = this.services.ExchangeSharedAccounts.convertQuota(
        this.optionsToCreateNewAccounts.quota.value,
        this.optionsToCreateNewAccounts.quota.unit,
        this.optionsToCreateNewAccounts.minQuota.unit,
      );

      this.formattedQuota = this.services.ExchangeSharedAccounts.getFormattedQuota(
        this.optionsToCreateNewAccounts.quota,
      );
    }
  }

  addingAccount() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );

    return this.services.ExchangeSharedAccounts.addingSharedAccount(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.accountBeingCreated,
    )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_SHARED_ACCOUNTS_add_success_message',
          ),
          data,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_account_error_message',
          ),
          failure.data,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
