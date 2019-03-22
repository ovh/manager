import isArray from 'lodash/isArray';
import map from 'lodash/map';

export default /* @ngInject */ (
  $scope,
  storage,
  $uibModalInstance,
) => {
  $scope.plural = isArray(storage) && storage.length > 1;
  $scope.name = isArray(storage)
    ? map(storage, 'name').join(', ')
    : storage.name;

  $scope.valid = {
    value: true,
  };

  $scope.confirm = () => {
    $uibModalInstance.close();
  };

  $scope.cancel = () => {
    $uibModalInstance.dismiss();
  };
};
