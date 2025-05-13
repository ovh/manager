import angular from 'angular';
import clone from 'lodash/clone';
import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isFinite from 'lodash/isFinite';
import isObject from 'lodash/isObject';
import reduce from 'lodash/reduce';

export default class ExchangeWizardHostedCreationEmailCreationUpdateController {
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
    this.formerPrimaryEmailAddress = this.navigation.currentActionData.primaryEmailAddress;

    this.model = {
      domain: this.navigation.currentActionData.domain,
      displayName: this.navigation.currentActionData.displayName,
      firstName: this.navigation.currentActionData.firstName,
      lastName: this.navigation.currentActionData.lastName,
      login: this.formerPrimaryEmailAddress.split('@')[0],
    };
    this.canMigrate = false;

    this.initialModel = clone(this.model);

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

  formCanBeSubmitted() {
    if (!isObject(this.addForm)) {
      return false;
    }

    const formIsValid = this.addForm.$valid;
    const passwordMustBeChanged = this.changePassword;

    if (passwordMustBeChanged) {
      const passwordChangeIsValid =
        this.addForm.password.$dirty &&
        this.addForm.passwordConfirmation.$dirty;

      return formIsValid && passwordChangeIsValid;
    }

    const formHasChanged =
      reduce(
        this.initialModel,
        (result, value, key) =>
          value === this.model[key] ? result : result.concat(key),
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
        if (!isEmpty(this.model.password)) {
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
}
