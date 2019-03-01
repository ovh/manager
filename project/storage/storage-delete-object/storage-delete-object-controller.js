angular.module('managerApp').controller('RA.storage.deleteObject',
  ($scope, params, $uibModalInstance) => {
    $scope.elem = params;

    $scope.loaders = {
      deleting: false,
    };
    $scope.valid = {
      value: true,
    };

    $scope.names = function () {
      return _.map($scope.elem, 'name').join('<br />');
    };

    $scope.confirm = function () {
      $uibModalInstance.close($scope.elem);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  });
