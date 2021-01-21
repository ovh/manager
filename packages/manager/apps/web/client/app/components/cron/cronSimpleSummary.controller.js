export default /* @ngInject */ ($scope, $rootScope, WucCronValidator) => {
  // Hack for trads
  $scope.tr = $rootScope.tr;
  $scope.trpl = $rootScope.trpl;

  $scope.mode = $scope.crontabObject.getCronMode();
  $scope.cron = $scope.crontabObject.getCronValue();

  // Returns an array of selected items
  $scope.getSimpleModeItems = (field) =>
    WucCronValidator.getSimpleModeItems($scope.cron, field);
};
