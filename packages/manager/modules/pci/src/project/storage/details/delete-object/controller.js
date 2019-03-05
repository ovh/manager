import _ from 'lodash';

export default /* @ngInject */ (
  $scope,
  params,
  $uibModalInstance,
) => {
  $scope.elem = params;

  $scope.loaders = {
    deleting: false,
  };
  $scope.valid = {
    value: true,
  };

  $scope.names = () => {
    return _.map($scope.elem, 'name').join('<br />');
  };

  $scope.confirm = () => {
    $uibModalInstance.close($scope.elem);
  };

  $scope.cancel = () => {
    $uibModalInstance.dismiss();
  };
}
