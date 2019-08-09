angular.module('App').controller('SecondaryDnsCtrl', ($scope, $timeout, $stateParams, $translate, Server) => {
  $scope.loadSecondaryDns = ({ offset, pageSize }) => Server
    .getSecondaryDnsList($stateParams.productId, pageSize, offset - 1)
    .then(
      result => ({
        data: _.get(result, 'list.results'),
        meta: {
          totalCount: result.count,
        },
      }),
      (err) => {
        _.set(err, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_configuration_secondary_dns_fail'), err);
      },
    );

  $scope.refresh = () => {
    $scope.reload = true;
    $timeout(() => {
      $scope.reload = false;
    });
  };

  $scope.$on('dedicated.secondarydns.reload', $scope.refresh);
});
