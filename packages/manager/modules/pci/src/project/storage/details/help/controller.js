export default /* @ngInject */ function (
  $scope,
  $uibModalInstance,
) {
  $scope.confirm = () => {
    $uibModalInstance.dismiss();
  };
}
