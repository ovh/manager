import find from 'lodash/find';

angular.module('App').controller('DedicatedCloudNewPricesInformationCtrl', [
  '$scope',

  function DedicatedCloudNewPricesInformationCtrl($scope) {
    $scope.loader = true;
    $scope.pricesInformationData = angular.copy($scope.currentActionData)
      .filter((resource) => resource.changed === true);

    $scope.pricesInformationIds = $scope.pricesInformationData
      .map((pricesInformation) => pricesInformation.name);

    $scope.transformItem = function transformItem(item) {
      $scope.loader = true;
      return find(
        $scope.pricesInformationData,
        (pricesInformation) => pricesInformation.name === item,
      );
    };

    $scope.onTransformItemDone = function onTransformItemDone() {
      $scope.loader = false;
    };
  },
]);
