angular.module('Module.exchange.controllers').controller(
  'exchangeWizardHostedCreationEmailCreationUpdateController',
  class ExchangeWizardHostedCreationEmailCreationUpdateController {
    constructor(
      Exchange,
      ExchangePassword,
      messaging,
      navigation,
      $rootScope,
      $scope,
      $timeout,
      $translate,
      wizardHostedCreationEmailCreation,
    ) {
      this.Exchange = Exchange;
      this.ExchangePassword = ExchangePassword;
      this.messaging = messaging;
      this.navigation = navigation;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.wizardHostedCreationEmailCreation = wizardHostedCreationEmailCreation;
    }

    $onInit() {
      this.$routerParams = this.Exchange.getParams();
      this.formerPrimaryEmailAddress = this.navigation.currentActionData.primaryEmailAddress;

      this.model = {
        domain: this.navigation.currentActionData.domain,
        displayName: this.navigation.currentActionData.displayName,
        firstName: this.navigation.currentActionData.firstName,
        lastName: this.navigation.currentActionData.lastName,
        login: this.formerPrimaryEmailAddress.split('@')[0],
      };
      this.canMigrate = false;

      this.initialModel = _(this.model).clone();

      this.changePassword = false;
      this.domainForDisplay = `@${this.model.domain}`;

      this.hideCancelButton = false;
      this.hideConfirmButton = false;
      this.dataHasBeenSubmitted = false;

      this.$scope.updatingEmailAddress = () => this.updatingEmailAddress();
      this.$scope.hideCancelButton = () => this.hideCancelButton;
      this.$scope.hideConfirmButton = () => !this.hideConfirmButton;

      return this.retrievingServiceParameters();
    }

    retrievingServiceParameters() {
      this.isLoading = true;

      return this.wizardHostedCreationEmailCreation
        .retrievingServiceParameters(this.$routerParams.organization, this.$routerParams.productId)
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
      const firstName = _(this.model).get('firstName', '');
      const lastName = _(this.model).get('lastName', '');

      const separator = _(firstName).isEmpty() || _(lastName).isEmpty() ? '' : ' ';

      this.model.displayName = `${firstName}${separator}${lastName}`;
    }

    validatePassword() {
      const passwordIsLongEnough = _(this.serviceParameters.minPasswordLength).isFinite()
        ? !_(this.model.password).isEmpty()
          && this.model.password.length >= this.serviceParameters.minPasswordLength
        : true;
      this.addForm.password.$setValidity('passwordLength', passwordIsLongEnough);

      const passwordIsComplexEnough = _(this.serviceParameters.complexityEnabled).isBoolean()
        && this.serviceParameters.complexityEnabled
        ? this.ExchangePassword.passwordComplexityCheck(this.model.password)
        : true;
      this.addForm.password.$setValidity('passwordComplexity', passwordIsComplexEnough);

      const passwordEqualsConfirmation = this.addForm.passwordConfirmation.$pristine
        || this.model.password === this.model.passwordConfirmation;
      this.addForm.password.$setValidity('passwordEquality', passwordEqualsConfirmation);
    }

    scrollToBottom() {
      this.$timeout(() => {
        document.getElementById('email-creation-main-container').scrollIntoView(false);
      });
    }

    scrollToTop() {
      this.$timeout(() => {
        document.getElementById('wizard-error-message').scrollIntoView(true);
      });
    }

    formCanBeSubmitted() {
      if (!_(this.addForm).isObject()) {
        return false;
      }

      const formIsValid = this.addForm.$valid;
      const passwordMustBeChanged = this.changePassword;

      if (passwordMustBeChanged) {
        const passwordChangeIsValid = (
          this.addForm.password.$dirty
          && this.addForm.passwordConfirmation.$dirty
        );

        return formIsValid && passwordChangeIsValid;
      }

      const formHasChanged = _(this.initialModel).reduce(
        (result, value, key) => (value === this.model[key] ? result : result.concat(key)),
        [],
      ).length > 0;

      return formIsValid && formHasChanged;
    }

    updatingEmailAddress() {
      this.dataHasBeenSubmitted = true;
      this.hideCancelButton = true;
      this.hideConfirmButton = true;

      const model = {
        displayName: this.model.displayName || this.model.login,
        domain: this.model.domain,
        firstName: this.model.firstName || '',
        lastName: this.model.lastName || '',
        login: this.model.login,
      };

      return this.wizardHostedCreationEmailCreation
        .addingOrUpdatingEmailAccount(
          this.$routerParams.organization,
          this.$routerParams.productId,
          this.formerPrimaryEmailAddress,
          model,
        )
        .then(() => {
          if (!_(this.model.password).isEmpty()) {
            return this.wizardHostedCreationEmailCreation.updatingPassword(
              this.$routerParams.organization,
              this.$routerParams.productId,
              `${this.model.login}@${this.model.domain}`,
              this.model.password,
            );
          }

          return null;
        })
        .then(() => {
          this.scrollToBottom();
        })
        .catch((error) => {
          if (error.message === 'Email address is already used.') {
            this.messaging.writeError(
              this.$translate.instant(
                'exchange_wizardHostedCreation_emailCreation_add_accountCreation_alreadyExist_error',
                {
                  t0: `${this.model.login}@${this.model.domain}`,
                },
              ),
              error,
            );
          } else {
            this.messaging.writeError(
              this.$translate.instant(
                'exchange_wizardHostedCreation_emailCreation_add_accountCreation_error',
              ),
              error,
            );
          }

          this.scrollToTop();
        })
        .finally(() => {
          this.$rootScope.$broadcast('exchange.wizard.request.done');
          this.navigation.resetAction();
        });
    }
  },
);
