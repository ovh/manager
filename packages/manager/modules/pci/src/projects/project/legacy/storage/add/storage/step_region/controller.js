export default /* @ngInject */ function (
  $scope,
  CucRegionService,
) {
  $scope.regionService = CucRegionService;
  $scope.childStep = 'containerType';

  $scope.model.region = null;

  $scope.clickOnRegion = function clickOnRegionFn() {
    $scope.loadStep($scope.childStep);
  };
}
