export default /* @ngInject */ (
  $scope,
  $translate,
  IpSpam,
  $timeout,
  Alerter,
) => {
  $scope.tableLoading = false;
  $scope.details = null;
  $scope.pageSizes = [5, 10, 15];

  $scope.model = {
    block: $scope.currentActionData.block,
    ip: $scope.currentActionData.ip,
    timestamp: $scope.currentActionData.timestamp,
    search: null,
  };

  $scope.$watch(
    'model.search',
    (newValue) => {
      if ($scope.model.search !== null) {
        if ($scope.model.search === '') {
          $scope.$broadcast(
            'paginationServerSide.loadPage',
            1,
            'antispamDetails',
          );
        } else {
          $scope.searchLoading = true;
          $timeout(() => {
            if ($scope.model.search === newValue) {
              $scope.$broadcast(
                'paginationServerSide.loadPage',
                1,
                'antispamDetails',
              );
            }
          }, 500);
        }
      }
    },
    true,
  );

  $scope.loadSpams = function loadSpams(count, offset) {
    $scope.tableLoading = true;
    IpSpam.getIpSpamStats(
      $scope.model.block,
      $scope.model.ip,
      $scope.model.timestamp,
      count,
      offset,
      $scope.model.search,
    ).then(
      (stats) => {
        $scope.details = stats;
        $scope.tableLoading = false;
      },
      (reason) => {
        $scope.tableLoading = false;
        $scope.resetAction();
        Alerter.alertFromSWS(
          $translate.instant('server_configuration_mitigation_auto_success'),
          reason,
        );
      },
    );
  };
};
