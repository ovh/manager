export default /* @ngInject */ (
  $rootScope,
  $timeout,
  $scope,
  $location,
  $stateParams,
  $translate,
  Alerter,
  goToDashboard,
  Ip,
  IpSpam,
) => {
  $scope.ipspam = null;

  function init(params) {
    $scope.ipspam = null;
    $scope.block = params.ip;
    $scope.ipSpamming = params.ipSpamming;
  }

  $scope.loadAntispam = function loadAntispam(count, offset) {
    if (!$scope.block) {
      return;
    }

    $scope.loadingAntispam = true;

    IpSpam.killPollSpamState();

    IpSpam.getIpSpam($scope.block, $scope.ipSpamming, count, offset).then(
      (ipSpamming) => {
        $scope.ipspam = ipSpamming;

        // Poll state if pending
        if (ipSpamming && ipSpamming.state === 'UNBLOCKING') {
          IpSpam.pollSpamState($scope.block, $scope.ipSpamming).then((data) => {
            if (data && data.state && $scope.ipspam && $scope.ipspam.state) {
              $scope.ipspam.state = data.state;
            }
          });
        }

        $scope.loadingAntispam = false;
        $scope.loadingPeriods = false;
      },
      (reason) => {
        $scope.loadingAntispam = false;
        $scope.loadingPeriods = false;
        Alerter.alertFromSWS(
          $translate.instant('ip_antispam_load_error'),
          reason,
        );
      },
    );
  };

  $scope.hideAntispam = function hideAntispam() {
    goToDashboard();
    IpSpam.killPollSpamState();
  };

  $scope.$on('$destroy', () => {
    IpSpam.killPollSpamState();
  });

  $scope.unblockIp = function unblockIp() {
    IpSpam.unblockIp($scope.block, $scope.ipspam.ip).then(
      () => {
        init({ ip: $scope.block, ipSpamming: $scope.ipSpamming });
        $timeout(() => {
          $scope.$broadcast('paginationServerSide.reload');
        }, 99);
      },
      (data) => {
        Alerter.alertFromSWS(
          $translate.instant('ip_antispam_unblock_error', {
            t0: $scope.ipspam.ip,
          }),
          data.data,
        );
      },
    );
  };

  // Come from button
  $scope.$on('ips.antispam.display', (event, params) => {
    init(params);
    $timeout(() => {
      $scope.$broadcast('paginationServerSide.loadPage', 1);
    }, 99);
  });

  // Come from URL
  if (
    $location.search().action === 'antispam' &&
    $location.search().ip &&
    $location.search().ipSpamming
  ) {
    init({
      ip: $location.search().ip,
      ipSpamming: $location.search().ipSpamming,
    });
    $timeout(() => {
      $scope.$broadcast('paginationServerSide.loadPage', 1);
    }, 99);
    $location.search('action', null);
    $location.search('ip', null);
    $location.search('ipSpamming', null);
  }
};
