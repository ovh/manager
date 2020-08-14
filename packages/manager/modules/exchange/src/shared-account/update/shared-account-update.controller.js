import angular from 'angular';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import values from 'lodash/values';

export default class ExchangeUpdateSharedAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeSharedAccounts,
    Alerter,
    navigation,
    messaging,
    $translate,
    formValidation,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeSharedAccounts,
      Alerter,
      navigation,
      messaging,
      $translate,
      formValidation,
    };

    this.$routerParams = wucExchange.getParams();
    this.isLoading = false;
    this.errors = {
      emailIsAlreadyTaken: false,
      emailLocalPartIsEmpty: false,
      emailLocalPartDoesntRespectsPattern: false,
      quotaIsWrong: false,
    };

    this.accountBeingUpdated = {
      firstName: navigation.currentActionData.firstName,
      lastName: navigation.currentActionData.lastName,
      displayName: navigation.currentActionData.displayName,
      hiddenFromGAL: navigation.currentActionData.hiddenFromGAL,
      mailingFilter: ['vaderetro'],
      quota: navigation.currentActionData.quota.value,
      sharedEmailAddress: navigation.currentActionData.sharedEmailAddress,
    };

    this.localPart = navigation.currentActionData.login;
    this.domain = this.services.navigation.currentActionData.completeDomain;
    this.originalQuota = navigation.currentActionData.quota.value;
    this.originalSharedEmailAddress =
      navigation.currentActionData.sharedEmailAddress;

    $scope.updatingAccount = () => this.updatingAccount();
    $scope.isAccountValid = () => this.isAccountValid();
    $scope.loadingUpdateOptions = () => this.loadingUpdateOptions();
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
    this.convertQuotas();
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
    const firstName = this.accountBeingUpdated.firstName || '';
    const separator =
      this.accountBeingUpdated.firstName && this.accountBeingUpdated.lastName
        ? ' '
        : '';
    const lastName = this.accountBeingUpdated.lastName || '';

    this.accountBeingUpdated.displayName = `${firstName}${separator}${lastName}`;
  }

  emailOnChange() {
    this.accountBeingUpdated.sharedEmailAddress = `${this.localPart}@${this.domain.name}`.toLowerCase();
    this.errors.emailIsAlreadyTaken = false;
    const matchingEmaiAddress = this.alreadyTakenEmails.find(
      (alreadyTakenEmail) =>
        this.accountBeingUpdated.sharedEmailAddress.toUpperCase() ===
        alreadyTakenEmail.toUpperCase(),
    );
    this.errors.emailIsAlreadyTaken = matchingEmaiAddress != null;
  }

  loadingUpdateOptions() {
    this.isLoading = true;

    return this.services.ExchangeSharedAccounts.retrievingNewSharedAccountOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((data) => {
        this.optionsToUpdateAccount = angular.copy(data);
        this.alreadyTakenEmails = data.takenEmails;

        // Check if max quota is not under min quota or account quota + max quota
        const minQuota = get(this.optionsToUpdateAccount, 'minQuota.value', 0);
        const maxQuota = get(this.optionsToUpdateAccount, 'maxQuota.value', 0);
        const maxUpdateQuota = Math.max(
          minQuota,
          this.originalQuota + maxQuota,
        );

        if (maxQuota < maxUpdateQuota) {
          const {
            value,
            unit,
          } = this.services.ExchangeSharedAccounts.formatQuota({
            value: maxUpdateQuota,
            unit: this.optionsToUpdateAccount.maxQuota.unit,
          });

          Object.assign(this.optionsToUpdateAccount, {
            quota: this.services.ExchangeSharedAccounts.formatQuota({
              value: this.originalQuota,
              unit: this.optionsToUpdateAccount.minQuota.unit,
            }),
            availableQuotaUnits: this.services.ExchangeSharedAccounts.getQuotaUnitRange(
              this.optionsToUpdateAccount.minQuota.unit,
              unit,
            ),
            maxQuota: Object.assign(
              angular.copy(this.optionsToUpdateAccount.maxQuota),
              {
                value: maxUpdateQuota,
                unit: this.optionsToUpdateAccount.maxQuota.unit,
                toDisplay: { value, unit },
              },
            ),
          });

          this.accountBeingUpdated.quota = this.optionsToUpdateAccount.quota.value;
          this.minQuota = this.optionsToUpdateAccount.minQuota.value;
          this.maxQuota = this.optionsToUpdateAccount.maxQuota.value;
        }

        if (isEmpty(this.optionsToUpdateAccount.availableDomains)) {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_ACTION_add_no_domains'),
          );
          this.services.navigation.resetAction();
        } else {
          this.domain = find(
            this.optionsToUpdateAccount.availableDomains,
            (domain) => domain.name === this.domain.name,
          );
        }
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_account_option_fail',
          ),
          failure,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  convertQuotas() {
    this.selectQuota();

    this.minQuota = this.services.ExchangeSharedAccounts.convertQuota(
      this.optionsToUpdateAccount.minQuota.value,
      this.optionsToUpdateAccount.minQuota.unit,
      this.optionsToUpdateAccount.quota.unit,
    );

    this.maxQuota = this.services.ExchangeSharedAccounts.convertQuota(
      this.optionsToUpdateAccount.maxQuota.value,
      this.optionsToUpdateAccount.maxQuota.unit,
      this.optionsToUpdateAccount.quota.unit,
    );
  }

  selectQuota() {
    if (this.optionsToUpdateAccount.quota.value) {
      this.accountBeingUpdated.quota = this.services.ExchangeSharedAccounts.convertQuota(
        this.optionsToUpdateAccount.quota.value,
        this.optionsToUpdateAccount.quota.unit,
        this.optionsToUpdateAccount.minQuota.unit,
      );

      this.formattedQuota = this.services.ExchangeSharedAccounts.getFormattedQuota(
        this.optionsToUpdateAccount.quota,
      );
    }
  }

  isAccountValid() {
    return (
      this.sharedAccountForm != null &&
      this.sharedAccountForm.$dirty &&
      !includes(values(this.errors), true)
    );
  }

  updatingAccount() {
    return this.services.ExchangeSharedAccounts.updatingSharedAccount(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.originalSharedEmailAddress,
      this.accountBeingUpdated,
    )
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_SHARED_ACCOUNTS_update_success_message',
          ),
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_ACTION_add_account_error_message',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
