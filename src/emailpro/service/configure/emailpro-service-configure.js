angular.module('App').controller('EmailProServicesConfigureCtrl', ['$scope', '$translate', 'Api.EmailPro', 'EmailPro', function ($scope, $translate, APIEmailPro, EmailPro) {
  const { exchange } = $scope.currentActionData;

  $scope.loaders = {
    details: true,
    put: false,
  };

  function getDetails() {
    return APIEmailPro.get('/{exchangeService}', {
      urlParams: {
        exchangeService: exchange.domain,
      },
    }).then((serviceDescription) => {
      $scope.service = serviceDescription;
      $scope.service.lockoutThreshold = angular.isNumber($scope.service.lockoutThreshold)
        ? $scope.service.lockoutThreshold : 0;

      $scope.service.minPasswordLength = angular.isNumber($scope.service.minPasswordLength)
        ? $scope.service.minPasswordLength : 0;
      $scope.service.minPasswordAge = angular.isNumber($scope.service.minPasswordAge)
        ? $scope.service.minPasswordAge : 0;
      $scope.service.maxPasswordAge = angular.isNumber($scope.service.maxPasswordAge)
        ? $scope.service.maxPasswordAge : 0;
      $scope.loaders.details = false;
      return $scope.service;
    }, () => {
      $scope.loaders.details = false;
    });
  }

  $scope.service = {};

  $scope.formIsValid = {
    value: true,
  };

  $scope.putDetails = function () {
    $scope.loaders.put = true;

    const dataToSend = {
      complexityEnabled: $scope.service.complexityEnabled,
      lockoutThreshold: $scope.service.lockoutThreshold || null,
      maxPasswordAge: $scope.service.maxPasswordAge || null,
      minPasswordAge: $scope.service.minPasswordAge || null,
      minPasswordLength: $scope.service.minPasswordLength || null,
    };

    if ($scope.service.lockoutThreshold > 0) {
      dataToSend.lockoutDuration = $scope.service.lockoutDuration;
      dataToSend.lockoutObservationWindow = $scope.service.lockoutObservationWindow;
    }

    return APIEmailPro.put('/{exchangeService}', {
      urlParams: {
        exchangeService: exchange.domain,
      },
      data: dataToSend,
    }).then(() => {
      $scope.resetAction();
      EmailPro.resetAccounts();
      $scope.loaders.put = false;
      $scope.setMessage($translate.instant('emailpro_ACTION_configure_success'), { status: 'success' });
    }, (reason) => {
      $scope.resetAction();
      $scope.loaders.put = false;
      _.assign(reason.data, { type: 'ERROR' });
      $scope.setMessage($translate.instant('emailpro_ACTION_configure_error'), reason.data);
    });
  };

  getDetails();
}]).controller('EmailProServicesConfigureFormCtrl', ['$scope', function ($scope) {
  const self = this;
  const intRegex = /^\d+$/;

  function setValidity() {
    $scope.formIsValid.value = $scope.serviceForm.$valid;
  }

  this.minPasswordLengthCheck = function (input) {
    let intValue;
    const value = input.$viewValue;

    input.$setValidity('mustBeInteger', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);

    if (value) {
      try {
        intValue = parseInt(value, 10);
        if (intRegex.test(value) && !isNaN(intValue)) { // eslint-disable-line
          if (intValue !== 0) {
            input.$setValidity('min', intValue >= 3);
          }
          input.$setValidity('max', intValue <= 14);
        } else {
          throw 'NaN'; // eslint-disable-line
        }
      } catch (e) {
        input.$setValidity('mustBeInteger', false);
      }
    }
  };

  this.minPasswordAgeCheck = function (input) {
    let intValue;
    const value = input.$viewValue;

    input.$setValidity('mustBeInteger', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('minToBigForMax', true);

    if (value !== undefined && value !== null) {
      try {
        intValue = parseInt(value, 10);
        if (intRegex.test(value) && !isNaN(intValue)) { // eslint-disable-line
          if ($scope.service.maxPasswordAge === 0) {
            input.$setValidity('min', intValue >= 0);
            input.$setValidity('max', intValue <= 90);
          } else if (intValue !== 0) {
            input.$setValidity('minToBigForMax', intValue < +$scope.service.maxPasswordAge);
          }
        } else {
          throw 'NaN'; // eslint-disable-line
        }
      } catch (e) {
        input.$setValidity('mustBeInteger', false);
      }
    }
  };

  this.maxPasswordAgeCheck = function (input) {
    let intValue;
    const value = input.$viewValue;

    input.$setValidity('mustBeInteger', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('maxToSmallForMin', true);

    if (value) {
      try {
        intValue = parseInt(value, 10);
        if (intRegex.test(value) && !isNaN(intValue)) { // eslint-disable-line
          input.$setValidity('min', intValue >= 0);
          input.$setValidity('max', intValue <= 90);

          if (intValue !== 0) {
            input.$setValidity('maxToSmallForMin', intValue > +$scope.service.minPasswordAge);
          }
        } else {
          throw 'NaN'; // eslint-disable-line
        }
      } catch (e) {
        input.$setValidity('mustBeInteger', false);
      }
    }
  };

  this.lockoutThresholdCheck = function (input) {
    if (!input) {
      return null;
    }

    let intValue;
    const value = input.$viewValue;

    input.$setValidity('mustBeInteger', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);

    if (value != null) {
      try {
        intValue = parseInt(value, 10);
      } catch (err) {
        return input.$setValidity('number', false);
      }
      if (intRegex.test(value) && !isNaN(intValue)) { // eslint-disable-line
        input.$setValidity('min', intValue >= 0);
        input.$setValidity('max', intValue <= 14);
      } else {
        return input.$setValidity('number', false);
      }
    }
    self.lockoutObservationWindowCheck($scope.serviceForm.lockoutObservationWindow);
    self.lockoutDurationCheck($scope.serviceForm.lockoutDuration);
    return null;
  };

  this.lockoutObservationWindowCheck = function (input) {
    if (!input) {
      return null;
    }

    let intValue;
    const value = input.$viewValue;

    input.$setValidity('mustBeInteger', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('toBigForDuration', true);

    if (value != null) {
      try {
        intValue = parseInt(value, 10);
      } catch (err) {
        return input.$setValidity('number', false);
      }
      if ($scope.service.lockoutThreshold !== 0) {
        if (isNaN(intValue)) { // eslint-disable-line
          input.$setValidity('number', false);
        } else if (intRegex.test(value)) {
          input.$setValidity('min', intValue >= 1);
          input.$setValidity('max', intValue <= 90);
          if ($scope.service.lockoutDuration && $scope.service.lockoutDuration > 0) {
            input.$setValidity('toBigForDuration', intValue <= $scope.service.lockoutDuration);
          }
        } else {
          input.$setValidity('mustBeInteger', false);
        }
      } else {
        input.$setValidity('min', true);
        input.$setValidity('required', true);
      }
    }
    return null;
  };

  this.lockoutDurationCheck = function (input) {
    if (!input) {
      return null;
    }

    let intValue;
    const value = input.$viewValue;

    input.$setValidity('min', true);
    input.$setValidity('max', true);

    if (value) {
      try {
        intValue = parseInt(value, 10);
      } catch (err) {
        return input.$setValidity('number', false);
      }
      if ($scope.service.lockoutThreshold !== 0) {
        if (isNaN(intValue)) { // eslint-disable-line
          input.$setValidity('number', false);
        } else if (intRegex.test(value)) {
          input.$setValidity('min', intValue >= $scope.service.lockoutObservationWindow && intValue > 0);
          input.$setValidity('max', intValue <= 90);
        }
      } else {
        input.$setValidity('number', true);
      }
    } else if ($scope.service.lockoutThreshold !== 0) {
      input.$setValidity('number', false);
    } else {
      input.$setValidity('number', true);
      input.$setValidity('required', true);
    }
    self.lockoutObservationWindowCheck($scope.serviceForm.lockoutObservationWindow);
    return null;
  };

  $scope.check = function (input) {
    self[`${input.$name}Check`](input);
    setValidity();
  };

  $scope.checkPasswordAge = function () {
    $scope.check($scope.serviceForm.maxPasswordAge);
    $scope.check($scope.serviceForm.minPasswordAge);
  };
}]);
