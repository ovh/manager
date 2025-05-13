import angular from 'angular';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isFinite from 'lodash/isFinite';

export default class ExchangeWizardHostedCreationEmailCreationAddController {
  /* @ngInject */
  constructor(
    wucExchange,
    wucExchangePassword,
    messaging,
    navigation,
    $rootScope,
    $scope,
    $timeout,
    $translate,
    wizardHostedCreationEmailCreation,
  ) {
    this.wucExchange = wucExchange;
    this.wucExchangePassword = wucExchangePassword;
    this.messaging = messaging;
    this.navigation = navigation;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.wizardHostedCreationEmailCreation = wizardHostedCreationEmailCreation;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.formerEmailAccount = this.navigation.currentActionData.formerEmailAddress;
    this.model = {
      domain: this.navigation.currentActionData.domainName,
    };
    this.canMigrate = false;

    this.domainForDisplay = `@${this.model.domain}`;

    this.hideCancelButton = false;
    this.hideConfirmButton = false;
    this.dataHasBeenSubmitted = false;

    this.$scope.tryingToCustomizeEmailAddress = () =>
      this.tryingToCustomizeEmailAddress();
    this.$scope.hideCancelButton = () => this.hideCancelButton;
    this.$scope.hideConfirmButton = () => !this.hideConfirmButton;

    return this.retrievingServiceParameters();
  }

  retrievingServiceParameters() {
    this.isLoading = true;

    return this.wizardHostedCreationEmailCreation
      .retrievingServiceParameters(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
      .then((serviceParameters) => {
        this.serviceParameters = {
          complexityEnabled: serviceParameters.complexityEnabled,
          minPasswordLength: serviceParameters.minPasswordLength,
        };
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_wizardHostedCreation_emailCreation_add_serviceParametersRetrieval_error',
          ),
          error,
        );
      })
      .finally(() => {
        this.isLoading = false;
        this.$timeout(() => {
          angular
            .element('#domainInput')
            .css('width', `${(this.domainForDisplay.length + 1) * 8 + 2}px`);
        });
      });
  }

  updateDisplayName() {
    const firstName = get(this.model, 'firstName', '');
    const lastName = get(this.model, 'lastName', '');

    const separator = isEmpty(firstName) || isEmpty(lastName) ? '' : ' ';

    this.model.displayName = `${firstName}${separator}${lastName}`;
  }

  validatePassword() {
    const passwordIsLongEnough = isFinite(
      this.serviceParameters.minPasswordLength,
    )
      ? !isEmpty(this.model.password) &&
        this.model.password.length >= this.serviceParameters.minPasswordLength
      : true;
    this.addForm.password.$setValidity('passwordLength', passwordIsLongEnough);

    const passwordIsComplexEnough =
      isBoolean(this.serviceParameters.complexityEnabled) &&
      this.serviceParameters.complexityEnabled
        ? this.wucExchangePassword.passwordComplexityCheck(this.model.password)
        : true;
    this.addForm.password.$setValidity(
      'passwordComplexity',
      passwordIsComplexEnough,
    );

    const passwordEqualsConfirmation =
      this.addForm.passwordConfirmation.$pristine ||
      this.model.password === this.model.passwordConfirmation;
    this.addForm.password.$setValidity(
      'passwordEquality',
      passwordEqualsConfirmation,
    );
  }

  tryingToCustomizeEmailAddress() {
    this.dataHasBeenSubmitted = true;
    this.hideCancelButton = true;
    this.hideConfirmButton = true;

    if (!this.canMigrate) {
      const model = {
        accountLicense: 'standard',
        displayName: this.model.displayName || this.model.login,
        domain: this.model.domain,
        firstName: this.model.firstName || '',
        lastName: this.model.lastName || '',
        login: this.model.login,
        mailingFilter: ['vaderetro'],
      };

      return this.wizardHostedCreationEmailCreation
        .addingOrUpdatingEmailAccount(
          this.$routerParams.organization,
          this.$routerParams.productId,
          this.formerEmailAccount.primaryEmailAddress,
          model,
        )
        .then(() =>
          this.wizardHostedCreationEmailCreation.updatingPassword(
            this.$routerParams.organization,
            this.$routerParams.productId,
            `${this.model.login}@${this.model.domain}`,
            this.model.password,
          ),
        )
        .then(() => {
          this.$rootScope.$broadcast('exchange.wizard.request.done');
          this.navigation.resetAction();
        })
        .catch((error) => {
          if (error.message === 'Email address is already used.') {
            return this.wizardHostedCreationEmailCreation.checkingMigration(
              model.domain,
              model.login,
              this.$routerParams.organization,
              this.formerEmailAccount.primaryEmailAddress,
            );
          }

          this.writeAndFocusOnError(
            'exchange_wizardHostedCreation_emailCreation_add_accountCreation_error',
            error,
          );
          return null;
        })
        .then((data) => {
          if (data == null) {
            this.navigation.resetAction();
          } else if (isArray(data.error) && !isEmpty(data.error)) {
            this.writeAndFocusOnError(
              'exchange_wizardHostedCreation_emailCreation_add_migrationChecking_error',
            );
            return null;
          } else {
            this.hideConfirmButton = false;
            this.canMigrate = true;
            this.scrollToBottom();
          }

          return null;
        })
        .catch(() => {
          this.writeAndFocusOnError(
            'exchange_wizardHostedCreation_emailCreation_add_migrationChecking_mxPlanTechContact',
          );
        })
        .finally(() => {
          this.dataHasBeenSubmitted = false;
          this.hideCancelButton = false;
        });
    }

    return this.migratingEmailAddress();
  }

  writeAndFocusOnError(message, error) {
    this.messaging.writeError(
      this.$translate.instant(message, {
        t0: error,
      }),
    );
    this.navigation.resetAction();
    this.scrollToTop();
  }

  scrollToBottom() {
    this.$timeout(() => {
      document
        .getElementById('email-creation-main-container')
        .scrollIntoView(false);
    });
  }

  scrollToTop() {
    this.$timeout(() => {
      document.getElementById('wizard-error-message').scrollIntoView(true);
    });
  }

  migratingEmailAddress() {
    this.dataHasBeenSubmitted = true;

    const model = {
      accountLicense: 'standard',
      displayName: this.model.displayName || this.model.login,
      domain: this.model.domain,
      firstName: this.model.firstName || '',
      lastName: this.model.lastName || '',
      login: this.model.login,
      mailingFilter: ['vaderetro'],
    };

    return this.wizardHostedCreationEmailCreation
      .executingMigration(
        model.domain,
        model.login,
        this.$routerParams.organization,
        this.formerEmailAccount.primaryEmailAddress,
        this.model.password,
      )
      .then(() => {
        this.scrollToBottom();
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant(
            'exchange_wizardHostedCreation_emailCreation_add_migration_error',
          ),
          error,
        );
        this.scrollToTop();
      })
      .finally(() => {
        this.$timeout(() => {
          this.$rootScope.$broadcast('exchange.wizard.request.done');
          this.navigation.resetAction();
          this.dataHasBeenSubmitted = false;
        }, 5000);
      });
  }
}
