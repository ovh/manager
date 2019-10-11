angular.module('App').controller('DedicatedCloudUserAddCtrl', ($scope, $stateParams, $translate, DedicatedCloud, Alerter) => {
  const regCase = new RegExp('[A-Z]');

  $scope.canSetPassword = false;

  $scope.loaders = {
    init: true,
    add: false,
  };

  $scope.newUser = {
    name: null,
    errorCase: false,
    right: null,
  };

  $scope.formUser = {
    formValid: false,
  };

  $scope.showError = {
    checkPassword: false,
  };

  $scope.passwordPolicy = $scope.currentActionData;

  $scope.addUser = function () {
    $scope.loaders.add = true;
    DedicatedCloud.addUser($stateParams.productId, $scope.newUser)
      .then(
        () => {
          Alerter.success($translate.instant('dedicatedCloud_users_add_start'));
        },
        (err) => {
          Alerter.alertFromSWS($translate.instant('dedicatedCloud_users_add_error'), err);
        },
      )
      .finally(() => {
        $scope.resetAction();
        $scope.loaders.add = false;
      });
  };

  $scope.caseControl = function () {
    if ($scope.newUser.name === undefined) {
      $scope.newUser.errorCase = false;
    } else if (regCase.test($scope.newUser.name)) {
      $scope.newUser.name = $scope.newUser.name.toLowerCase();
      $scope.newUser.errorCase = true;
    }
  };

  $scope.checkOptionsStates = function () {
    $scope.loaders.init = true;
    return DedicatedCloud.hasSecurityOption($stateParams.productId)
      .then((hasSecurityOption) => {
        $scope.canSetPassword = !hasSecurityOption;
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_users_password_reset_check_error'), err);
      })
      .finally(() => {
        $scope.loaders.init = false;
      });
  };
});

angular.module('App').controller('DedicatedCloudUserAddFormCtrl', ($scope, DedicatedCloud) => {
  $scope.userForm = null;

  $scope.$watch('userForm.$valid', () => {
    $scope.formUser.formValid = $scope.userForm.$valid;
  });

  $scope.getClassLabel = function (label, noDirty) {
    if (label && (noDirty || label.$dirty)) {
      return (label.$invalid && 'has-error') || 'has-success';
    }
    return '';
  };

  $scope.hasError = function (label) {
    return label.$invalid && label.$dirty;
  };

  $scope.checkPassword = function (password) {
    if (!password || password === '') {
      $scope.showError.checkPassword = false;
      return true;
    }

    $scope.newUser.password = password;

    const passwordIsCorrect = DedicatedCloud.checkPassword($scope.passwordPolicy, { password });
    $scope.showError.checkPassword = !passwordIsCorrect;

    return passwordIsCorrect;
  };

  $scope.validEmail = function (value) {
    if (!value || value === '') {
      return true;
    }

    return validator.isEmail(value);
  };
});
