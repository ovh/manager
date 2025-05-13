import size from 'lodash/size';

export default /* @ngInject */ ($scope, $q, $translate, License, Alerter) => {
  $scope.model = {
    license: $scope.currentActionData.license,
    modifying: false,
    availableOs: undefined,
    selectedOs: undefined,
    loading: true,
    operationIsPending: false,
    currentOs: undefined,
  };

  function getDirectAdminModels() {
    return License.getDirectAdminModels().then(
      ({ models }) => models['license.DirectAdminOsEnum'].enum,
    );
  }

  function getLicenseOs() {
    return License.getLicence(
      $scope.model.license.id,
      $scope.model.license.type,
    ).then(({ os }) => os);
  }

  function isTaskPending() {
    return License.tasks($scope.model.license, 'changeOs').then(
      (tasks) => size(tasks) > 0,
    );
  }

  function init() {
    $q.all({
      isTaskPending: isTaskPending(),
      os: getLicenseOs(),
      allOs: getDirectAdminModels(),
    })
      .then(({ allOs, os }) => {
        $scope.model.operationIsPending = false; // TODO result.isTaskPending;
        $scope.model.currentOs = os;
        $scope.model.selectedOs = os;
        $scope.model.availableOs = allOs;
      })
      .catch((err) => {
        $scope.exit(true);
        Alerter.alertFromSWS(
          $translate.instant('license_directadmin_changeOs_loading_error'),
          err,
        );
      })
      .finally(() => {
        $scope.model.loading = false;
      });
  }

  $scope.changeOs = function changeOs() {
    if ($scope.model.selectedOs && !$scope.model.modifying) {
      $scope.model.modifying = true;
      License.changeOs($scope.model.license, $scope.model.selectedOs)
        .then(() => {
          Alerter.success(
            $translate.instant('license_directadmin_changeOs_success'),
          );
        })
        .catch((err) => {
          Alerter.alertFromSWS(
            $translate.instant('license_directadmin_changeOs_fail'),
            err.message,
          );
        })
        .finally(() => {
          $scope.exit(true);
        });
    } else {
      $scope.resetAction();
    }
  };

  $scope.isValid = function isValid() {
    return (
      $scope.model.selectedOs !== '' &&
      $scope.model.selectedOs !== $scope.model.currentOs &&
      !$scope.model.operationIsPending &&
      !$scope.model.loading
    );
  };

  $scope.exit = function exit(osChanged) {
    if (osChanged) {
      $scope.$emit('License.Details.Refresh');
    }

    $scope.resetAction();
  };

  init();
};
