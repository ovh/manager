import isFinite from 'lodash/isFinite';
import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';

export default class ExchangeServicesConfigureCtrl {
  /* @ngInject */
  constructor(
    $scope,
    APIExchange,
    Exchange,
    $translate,
    navigation,
    messaging,
  ) {
    this.services = {
      $scope,
      APIExchange,
      Exchange,
      $translate,
      navigation,
      messaging,
    };

    this.exchange = Exchange.value;

    this.loaders = {
      details: true,
      put: false,
    };

    this.service = {};

    this.formIsValid = {
      value: true,
    };

    this.retrievingDetails();

    $scope.submitting = () => this.submitting();
    $scope.isFormValid = () => this.formIsValid.value;
  }

  retrievingDetails() {
    return this.services.APIExchange.get(
      '/{organizationName}/service/{exchangeService}',
      {
        urlParams: {
          organizationName: this.exchange.organization,
          exchangeService: this.exchange.domain,
        },
      },
    )
      .then((serviceDescription) => {
        this.service = serviceDescription;
        this.service.lockoutThreshold = isNumber(this.service.lockoutThreshold)
          ? this.service.lockoutThreshold
          : 0;
        this.service.minPasswordLength = isNumber(
          this.service.minPasswordLength,
        )
          ? this.service.minPasswordLength
          : 0;
        this.service.minPasswordAge = isNumber(this.service.minPasswordAge)
          ? this.service.minPasswordAge
          : 0;
        this.service.maxPasswordAge = isNumber(this.service.maxPasswordAge)
          ? this.service.maxPasswordAge
          : 0;
        this.service.passwordHistoryCount = isNumber(
          this.service.passwordHistoryCount,
        )
          ? this.service.passwordHistoryCount
          : 0;

        return this.service;
      })
      .finally(() => {
        this.loaders.details = false;
      });
  }

  submitting() {
    this.loaders.put = true;

    const dataToSend = {
      complexityEnabled: this.service.complexityEnabled,
      lockoutThreshold: this.service.lockoutThreshold || null,
      maxPasswordAge: this.service.maxPasswordAge || null,
      minPasswordAge: this.service.minPasswordAge || null,
      passwordHistoryCount:
        this.service.maxPasswordAge > 0
          ? this.service.passwordHistoryCount || null
          : null,
      minPasswordLength: this.service.minPasswordLength || null,
      spamAndVirusConfiguration: this.service.spamAndVirusConfiguration,
    };

    if (this.service.lockoutThreshold > 0) {
      dataToSend.lockoutDuration = this.service.lockoutDuration;
      dataToSend.lockoutObservationWindow = this.service.lockoutObservationWindow;
    }

    return this.services.Exchange.setConfiguration(
      this.exchange.organization,
      this.exchange.domain,
      dataToSend,
    )
      .then(() => {
        this.services.Exchange.resetAccounts();
        this.services.messaging.writeSuccess(
          this.services.$translate.instant('exchange_ACTION_configure_success'),
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_configure_error'),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  setValidity() {
    this.formIsValid.value = this.serviceForm.$valid;
  }

  static minPasswordLengthCheck(input) {
    input.$setValidity('min', true);
    input.$setValidity('max', true);

    const intValue = this.convertToNumber(input);
    if (isNumber(intValue)) {
      if (intValue !== 0) {
        input.$setValidity('min', intValue >= 3);
      }

      input.$setValidity('max', intValue <= 14);
    }
  }

  passwordHistoryCountCheck(input) {
    if (this.service.maxPasswordAge <= 0) {
      input.$setValidity('min', true);
      input.$setValidity('max', true);
      input.$setValidity('number', true);
      input.$setValidity('pattern', true);
      input.$setValidity('required', true);
    }
  }

  static minPasswordAgeCheck(input) {
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('minToBigForMax', true);

    const intValue = this.convertToNumber(input);
    if (isNumber(intValue)) {
      if (this.service.maxPasswordAge === 0) {
        input.$setValidity('min', intValue >= 0);
        input.$setValidity('max', intValue <= 90);
      } else if (intValue !== 0) {
        input.$setValidity(
          'minToBigForMax',
          intValue < +this.service.maxPasswordAge,
        );
      }
    }
  }

  maxPasswordAgeCheck(input) {
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('maxToSmallForMin', true);

    const intValue = ExchangeServicesConfigureCtrl.convertToNumber(input);
    if (isNumber(intValue)) {
      input.$setValidity('min', intValue >= 0);
      input.$setValidity('max', intValue <= 90);

      if (intValue !== 0) {
        input.$setValidity(
          'maxToSmallForMin',
          intValue > +this.service.minPasswordAge,
        );
      }
    }

    if (this.serviceForm.passwordHistoryCount != null) {
      this.serviceForm.passwordHistoryCount.$validate();
    }
  }

  lockoutThresholdCheck(input) {
    input.$setValidity('required', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);

    const intValue = ExchangeServicesConfigureCtrl.convertToNumber(input);
    if (isNumber(intValue)) {
      input.$setValidity('min', intValue >= 0);
      input.$setValidity('max', intValue <= 14);
    } else {
      input.$setValidity('required', false);
    }

    if (
      this.serviceForm.lockoutObservationWindow != null &&
      this.serviceForm.lockoutDuration != null
    ) {
      this.lockoutObservationWindowCheck(
        this.serviceForm.lockoutObservationWindow,
      );
      this.lockoutDurationCheck(this.serviceForm.lockoutDuration);
    }
  }

  lockoutObservationWindowCheck(input, comesFromLockoutDurationCheck = false) {
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('toBigForDuration', true);

    if (
      this.serviceForm.lockoutThreshold.$valid &&
      this.service.lockoutThreshold === 0
    ) {
      input.$setValidity('number', true);
      input.$setValidity('mustBeInteger', true);
      return;
    }

    const intValue = ExchangeServicesConfigureCtrl.convertToNumber(input);
    if (isNumber(intValue)) {
      input.$setValidity('min', intValue >= 1);
      input.$setValidity('max', intValue <= 90);

      if (
        isNumber(this.service.lockoutDuration) &&
        !isNaN(this.service.lockoutDuration)
      ) {
        input.$setValidity(
          'toBigForDuration',
          intValue <= this.service.lockoutDuration,
        );
      }
    }

    if (!comesFromLockoutDurationCheck) {
      this.lockoutDurationCheck(this.serviceForm.lockoutDuration, true);
    }
  }

  lockoutDurationCheck(input, comesFromLockoutObservationWindowCheck = false) {
    input.$setValidity('required', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);

    if (
      this.serviceForm.lockoutThreshold.$valid &&
      this.service.lockoutThreshold === 0
    ) {
      input.$setValidity('number', true);
      input.$setValidity('mustBeInteger', true);
      return;
    }

    const intValue = ExchangeServicesConfigureCtrl.convertToNumber(input);
    if (isNumber(intValue)) {
      input.$setValidity(
        'min',
        intValue >= this.service.lockoutObservationWindow && intValue > 0,
      );
      input.$setValidity('max', intValue <= 90);
    } else {
      input.$setValidity('required', false);
    }

    if (!comesFromLockoutObservationWindowCheck) {
      this.lockoutObservationWindowCheck(
        this.serviceForm.lockoutObservationWindow,
        true,
      );
    }
  }

  static convertToNumber(input) {
    input.$setValidity('number', true);
    input.$setValidity('mustBeInteger', true);
    const value = input.$viewValue;

    try {
      const intValue = parseInt(value, 10);
      if (isFinite(intValue)) {
        if (Number.isInteger(intValue)) {
          return intValue;
        }

        input.$setValidity('mustBeInteger', false);
      } else {
        input.$setValidity('number', false);
      }
    } catch (e) {
      input.$setValidity('number', false);
      input.$setValidity('mustBeInteger', false);
    }

    return null;
  }

  check(input) {
    if (input != null) {
      this[`${input.$name}Check`](input);
      this.setValidity();
    }
  }

  checkPasswordAge() {
    this.check(this.serviceForm.maxPasswordAge);
    this.check(this.serviceForm.minPasswordAge);
    this.check(this.serviceForm.passwordHistoryCount);
  }
}
