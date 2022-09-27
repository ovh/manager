export default /* @ngInject */ ($scope, IpVirtualMac, atInternet) => {
  $scope.data = $scope.currentActionData;
  $scope.loading = true;
  atInternet.trackPage({
    name: $scope.data?.tracking,
  });
  IpVirtualMac.getVirtualMacDetails(
    $scope.data.ipBlock.service.serviceName,
    $scope.data.ipBlock.virtualMac.virtualMacs[$scope.data.ip.ip],
    $scope.data.ip.ip,
  )
    .then((details) => {
      $scope.details = details;
      $scope.loading = false;
    })
    .catch(() => {
      $scope.loading = false;
    });

  $scope.closeAction = function closeAction() {
    atInternet.trackClick({
      name: `${$scope.data?.tracking}::close`,
      type: 'action',
    });
    $scope.resetAction();
  };
};
