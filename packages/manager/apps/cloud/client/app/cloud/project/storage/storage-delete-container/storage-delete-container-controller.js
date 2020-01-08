import isArray from 'lodash/isArray';
import map from 'lodash/map';

angular
  .module('managerApp')
  .controller(
    'RA.storage.deleteContainer',
    ($scope, storage, $uibModalInstance) => {
      $scope.plural = isArray(storage) && storage.length > 1;
      $scope.name = isArray(storage)
        ? map(storage, 'name').join(', ')
        : storage.name;

      $scope.valid = {
        value: true,
      };

      $scope.confirm = function confirm() {
        $uibModalInstance.close();
      };

      $scope.cancel = function cancel() {
        $uibModalInstance.dismiss();
      };
    },
  );
