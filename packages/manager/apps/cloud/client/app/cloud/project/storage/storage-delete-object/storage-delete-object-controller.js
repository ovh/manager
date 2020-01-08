import map from 'lodash/map';

angular
  .module('managerApp')
  .controller(
    'RA.storage.deleteObject',
    ($scope, params, $uibModalInstance) => {
      $scope.elem = params;

      $scope.loaders = {
        deleting: false,
      };
      $scope.valid = {
        value: true,
      };

      $scope.names = function names() {
        return map($scope.elem, 'name').join('<br />');
      };

      $scope.confirm = function confirm() {
        $uibModalInstance.close($scope.elem);
      };

      $scope.cancel = function cancel() {
        $uibModalInstance.dismiss();
      };
    },
  );
