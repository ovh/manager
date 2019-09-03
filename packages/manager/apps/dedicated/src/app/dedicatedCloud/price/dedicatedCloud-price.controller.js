import find from 'lodash/find';

angular.module('App').controller('DedicatedCloudNewPricesInformationCtrl', [
  '$scope',

  function ($scope) {
    $scope.loader = true;
    $scope.pricesInformationData = angular.copy($scope.currentActionData)
      .filter(resource => resource.changed === true);

    $scope.pricesInformationIds = $scope.pricesInformationData
      .map(pricesInformation => pricesInformation.name);

    $scope.transformItem = function (item) {
      $scope.loader = true;
      return find(
        $scope.pricesInformationData,
        pricesInformation => pricesInformation.name === item,
      );
    };

    $scope.onTransformItemDone = function () {
      $scope.loader = false;
    };
  },
]);
