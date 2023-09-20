import { TRACKING_PREFIX } from '../list.constant';

export default /* @ngInject */ function IpFirewallCtrl(
  $scope,
  $rootScope,
  $timeout,
  $translate,
  Ip,
  IpFirewall,
  goToDashboard,
  $location,
  $route,
  $stateParams,
  $http,
  atInternet,
) {
  const self = this;

  $scope.selectedBlock = null;
  $scope.selectedIp = null;
  $scope.rules = null;
  $scope.rulesLoading = false;
  $scope.rulesLoadingError = null;

  self.rulesTable = [];

  self.constants = {
    MAX_RULES: 20,
    PAGE_SIZE_MIN: 10,
    PAGE_SIZE_MAX: 20,
  };

  function paginate(pageSize, offset) {
    self.rulesTable = $scope.rules.list.results.slice(
      offset - 1,
      offset + pageSize - 1,
    );
  }

  function init(params) {
    $scope.rulesLoadingError = null;
    $scope.rules = null;
    if (params) {
      $scope.selectedBlock = params.ipBlock.ipBlock;
      $scope.selectedIp = params.ip.ip;
    }
    $timeout(() => {
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'rulesTable');
    }, 99);
    $scope.tracking = {
      'ip-firewall-add-rule': `${TRACKING_PREFIX}::ip::firewall::add-rule`,
      'ip-firewall-delete-rule': `${TRACKING_PREFIX}::ip::firewall::delete-rule`,
      'update-firewall-status': `${TRACKING_PREFIX}::ip::firewall::update-firewall-status`,
    };
    $scope.loadRules(self.FIREWALL_MAX_RULES, 0);
  }

  function defaultLoad() {
    init({
      ip: { ip: $location.search().ip },
      ipBlock: { ipBlock: $location.search().ipBlock },
    });
  }
  function reloadRules() {
    IpFirewall.killPollFirewallRule();
    $scope.$broadcast('paginationServerSide.reload', 'rulesTable');
  }

  function getFirewallDetail() {
    IpFirewall.getFirewallDetails($scope.selectedBlock, $scope.selectedIp).then(
      (firewallDetails) => {
        self.ipBlock = {
          ipBlock: $scope.selectedBlock,
        };
        self.firewallToggle = {
          status: firewallDetails.enabled,
          ip: $scope.selectedIp,
          firewall: firewallDetails.enabled ? 'ACTIVATED' : 'DEACTIVATED',
        };
      },
    );
  }

  function fetchRules(rulesCount, offset) {
    $scope.rulesLoading = true;

    IpFirewall.getFirewallRules(
      $scope.selectedBlock,
      $scope.selectedIp,
      rulesCount,
      offset,
    )
      .then(
        (rules) => {
          $scope.rules = rules;
          let options;

          if (
            $scope.rules &&
            $scope.rules.list &&
            $scope.rules.list.results &&
            $scope.rules.list.results.length
          ) {
            angular.forEach($scope.rules.list.results, (result, i) => {
              options = [];
              if (result.fragments) {
                options.push($translate.instant('ip_firewall_rule_fragments'));
              }
              if (result.tcpOption) {
                options.push(result.tcpOption);
              }

              $scope.rules.list.results[i].options = options.join('<br/>');

              // Go poll
              if (
                result.state === 'CREATION_PENDING' ||
                result.state === 'REMOVAL_PENDING'
              ) {
                IpFirewall.pollFirewallRule(
                  $scope.selectedBlock,
                  $scope.selectedIp,
                  result.sequence,
                ).then(() => {
                  reloadRules();
                });
              }
            });
          }
        },
        (reason) => {
          $scope.rulesLoadingError = reason.message;
        },
      )
      .finally(() => {
        $scope.rulesLoading = false;

        getFirewallDetail();

        // Pagination
        self.pageNumber = 1;
        self.pageSize = self.constants.PAGE_SIZE_MIN;
        self.pageSizeMax = self.constants.PAGE_SIZE_MAX;
        self.offset = 1 + (self.pageNumber - 1) * self.pageSize;
        paginate(self.pageSize, self.offset);
      });
  }

  $scope.$on('ips.firewall.informations.reload', () => {
    reloadRules();
  });

  $scope.$on('ips.firewall.cancelToggle', () => {
    getFirewallDetail();
  });

  $scope.loadRules = function loadRules(rulesCount, offset) {
    if (!$scope.selectedIp && !$scope.selectedBlock) {
      $scope.selectedIp = $stateParams.ip;
      $http
        .get(`/ip?ip=${window.encodeURIComponent($stateParams.ip)}`)
        .then(({ data }) => {
          if (data.length) {
            [$scope.selectedBlock] = data;
            fetchRules(rulesCount, offset);
          }
        });
    } else if ($scope.selectedIp) {
      fetchRules(rulesCount, offset);
    }
  };

  $scope.hideFirewall = function hideFirewall() {
    atInternet.trackClick({
      name: `${TRACKING_PREFIX}::ip::firewall::back`,
      type: 'action',
    });
    Ip.cancelActionParam('firewall');
    IpFirewall.killPollFirewallRule();
    goToDashboard();
  };

  // Come from button
  $scope.$on('ips.firewall.display', (event, params) => {
    init(params);
  });

  // Come from URL
  if ($location.search().action === 'firewall' && $location.search().ip) {
    IpFirewall.getFirewallDetails(
      $location.search().ipBlock,
      $location.search().ip,
    ).then(
      (firewallDetails) => {
        if (!firewallDetails.enabled) {
          $location.search('action', 'toggleFirewall');
          $route.reload();
        } else {
          defaultLoad();
        }
      },
      () => {
        $location.search('action', 'toggleFirewall');
        $route.reload();
      },
    );
  } else {
    init();
  }

  // Change page
  self.onChangePage = ({ pageSize, offset }) => {
    self.pageSize = pageSize;
    self.pageNumber = 1 + Math.floor((offset - 1) / pageSize);
    self.offset = 1 + (self.pageNumber - 1) * self.pageSize;
    $location.search('page', self.pageNumber);
    $location.search('pageSize', self.pageSize);
    paginate(pageSize, offset);
  };
}
