import map from 'lodash/map';

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

  $scope.names = () => map($scope.elem, 'name').join('<br />');

  $scope.confirm = () => {
    $uibModalInstance.close($scope.elem);
  };

  $scope.cancel = () => {
    $uibModalInstance.dismiss();
  };
};
