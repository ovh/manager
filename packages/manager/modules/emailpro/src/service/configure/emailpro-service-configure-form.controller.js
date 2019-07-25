export default /* @ngInject */ function ($scope) {
  const self = this;
  const intRegex = /^\d+$/;

  function setValidity() {
    $scope.formIsValid.value = $scope.serviceForm.$valid;
  }

  this.minPasswordLengthCheck = function minPasswordLengthCheck(input) {
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

  this.minPasswordAgeCheck = function minPasswordAgeCheck(input) {
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

  this.maxPasswordAgeCheck = function maxPasswordAgeCheck(input) {
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

  this.lockoutThresholdCheck = function lockoutThresholdCheck(input) {
    if (!input) {
      return null;
    }

    let intValue;
    const value = input.$viewValue;

    input.$setValidity('mustBeInteger', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('number', true);

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

  this.lockoutObservationWindowCheck = function lockoutObservationWindowCheck(input) {
    if (!input) {
      return null;
    }

    let intValue;
    const value = input.$viewValue;

    input.$setValidity('mustBeInteger', true);
    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('number', true);
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

  this.lockoutDurationCheck = function lockoutDurationCheck(input) {
    if (!input) {
      return null;
    }

    let intValue;
    const value = input.$viewValue;

    input.$setValidity('min', true);
    input.$setValidity('max', true);
    input.$setValidity('number', true);

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
    } else {
      input.$setValidity('number', true);
      input.$setValidity('required', true);
    }
    self.lockoutObservationWindowCheck($scope.serviceForm.lockoutObservationWindow);
    return null;
  };

  $scope.check = function check(input) {
    self[`${input.$name}Check`](input);
    setValidity();
  };

  $scope.checkPasswordAge = function checkPasswordAge() {
    $scope.check($scope.serviceForm.maxPasswordAge);
    $scope.check($scope.serviceForm.minPasswordAge);
  };
}
