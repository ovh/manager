angular.module('managerApp').controller('RA.add.storage.stepRegionCtrl',
  ['$scope', 'CucRegionService',
    function ($scope, CucRegionService) {
      $scope.regionService = CucRegionService;
      $scope.childStep = 'containerType';

      $scope.model.region = null;

      $scope.clickOnRegion = function () {
        $scope.loadStep($scope.childStep);
      };
    },
  ]);
