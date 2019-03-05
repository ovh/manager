import _ from 'lodash';

export default /* @ngInject */ (
  $scope,
  storage,
  $uibModalInstance,
) => {
  $scope.plural = _.isArray(storage) && storage.length > 1;
  $scope.name = _.isArray(storage)
    ? _.map(storage, 'name').join(', ')
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
