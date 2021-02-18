angular.module('managerApp').controller('RA.add.storage.stepRegionCtrl', [
  '$scope',
  'CucRegionService',
  function RAAddStorageStepRegionCtrl($scope, CucRegionService) {
    $scope.regionService = CucRegionService;
    $scope.childStep = 'containerType';

    $scope.model.region = null;

    $scope.clickOnRegion = function clickOnRegion() {
      $scope.loadStep($scope.childStep);
    };
  },
]);
