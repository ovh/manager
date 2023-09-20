import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';

export default /* @ngInject */ function IpGameFirewallCtrl(
  $location,
  $scope,
  $rootScope,
  $translate,
  goToDashboard,
  Ip,
  IpGameFirewall,
  Alerter,
  $q,
) {
  const self = this;
  const alert = 'ip_game_firewall_alert';

  self.goToDashboard = goToDashboard;

  self.constantes = {
    DELETE_RULE_PENDING: 'deleteRulePending',
    OK: 'ok',
    MAX_RULES: 30,
    PAGE_SIZE_MIN: 10,
    PAGE_SIZE_MAX: 30,
  };

  self.datas = {
    selectedBlock: null,
    selectedIp: null,
    firewall: null,
  };

  self.table = {
    rules: [],
  };

  self.loaders = {
    firewall: false,
    rules: false,
  };

  self.firewallModeEnabled = false;
  self.rules = [];

  function paginate(pageSize, offset) {
    self.rules = self.table.rules.slice(offset - 1, offset + pageSize - 1);
  }

  function getFirewall() {
    self.loaders.firewall = true;
    self.datas.firewall = null;
    IpGameFirewall.get(self.datas.selectedBlock, self.datas.selectedIp)
      .then(
        (firewall) => {
          self.datas.firewall = firewall;
          self.firewallModeEnabled = firewall.firewallModeEnabled;

          if (firewall.state !== self.constantes.OK) {
            IpGameFirewall.pollFirewallState(
              self.datas.selectedBlock,
              self.datas.selectedIp,
            ).then((_firewall) => {
              self.datas.firewall = _firewall;
            });
          }
        },
        () => {
          self.datas.firewall = null;
        },
      )
      .finally(() => {
        self.loaders.firewall = false;
      });
  }

  function getRules() {
    IpGameFirewall.killPollRuleState();
    self.loaders.rules = true;
    self.table.rules = [];
    IpGameFirewall.getRules(
      self.datas.selectedBlock,
      self.datas.selectedIp,
    ).then(
      (rules) => {
        const tablePromise = [];
        angular.forEach(rules, (ruleId) => {
          tablePromise.push(
            // eslint-disable-next-line no-use-before-define
            getRule(ruleId).then(
              (rule) => {
                self.table.rules.push(rule);
              },
              (error) => {
                self.table.rules.push({
                  errorMessage: $translate.instant(
                    'ip_game_mitigation_table_partial_error_info',
                    { t0: ruleId },
                  ),
                });
                return $q.reject(error);
              },
            ),
          );
        });

        if (tablePromise.length > 0) {
          $q.allSettled(tablePromise)
            .then(
              () => {
                // nothing
              },
              () => {
                Alerter.error(
                  $translate.instant('ip_game_mitigation_table_partial_error'),
                  alert,
                );
              },
            )
            .finally(() => {
              self.loaders.rules = false;
              paginate($scope.pageSize, $scope.offset);
            });
        } else {
          self.loaders.rules = false;
        }
      },
      () => {
        self.table.rules = null;
        self.loaders.rules = false;
      },
    );
  }

  function init() {
    getFirewall();
    getRules();

    // pagination
    const { page, pageSize } = $location.search();
    $scope.pageNumber = +page || 1;
    $scope.pageSize = +pageSize || self.constantes.PAGE_SIZE_MIN;
    $scope.pageSizeMax = self.constantes.PAGE_SIZE_MAX;
    if ($scope.pageNumber < 1) {
      $scope.pageNumber = 1;
    }
    if ($scope.pageSize < self.constantes.PAGE_SIZE_MIN) {
      $scope.pageSize = self.constantes.PAGE_SIZE_MIN;
    } else if ($scope.pageSize > self.constantes.PAGE_SIZE_MAX) {
      $scope.pageSize = self.constantes.PAGE_SIZE_MAX;
    }
    $scope.offset = 1 + ($scope.pageNumber - 1) * $scope.pageSize;
  }

  function changeStateRule(ruleId, state) {
    const index = findIndex(self.table.rules, { id: ruleId });
    if (
      index >= 0 &&
      index < self.table.rules.length &&
      self.table.rules[index]
    ) {
      self.table.rules[index].state = state;
    }
    paginate($scope.pageSize, $scope.offset);
  }

  function removeRule(ruleId) {
    self.table.rules = remove(
      self.table.rules,
      (ruleToDrop) => ruleToDrop.id !== ruleId,
    );
    paginate($scope.pageSize, $scope.offset);
  }

  function getRule(ruleId) {
    return IpGameFirewall.getRule(
      self.datas.selectedBlock,
      self.datas.selectedIp,
      ruleId,
    ).then((rule) => {
      if (rule.state !== self.constantes.OK) {
        IpGameFirewall.pollRuleState(
          self.datas.selectedBlock,
          self.datas.selectedIp,
          ruleId,
        ).then((rulePoll) => {
          switch (rulePoll.state) {
            case self.constantes.DELETE_RULE_PENDING:
              removeRule(ruleId);
              break;
            default:
              changeStateRule(ruleId, rulePoll.state);
              break;
          }
        });
      }
      return rule;
    });
  }

  $scope.$on('ips.gameFirewall.display.remove', (event, ruleId) => {
    changeStateRule(ruleId, self.constantes.DELETE_RULE_PENDING);

    IpGameFirewall.pollRuleState(
      self.datas.selectedBlock,
      self.datas.selectedIp,
      ruleId,
    ).then(() => {
      removeRule(ruleId);
    });
  });

  $scope.$on('ips.gameFirewall.display.add', (event, rule) => {
    self.table.rules.push(rule);
    paginate($scope.pageSize, $scope.offset);

    IpGameFirewall.pollRuleState(
      self.datas.selectedBlock,
      self.datas.selectedIp,
      rule.id,
    ).then((rulePoll) => {
      changeStateRule(rule.id, rulePoll.state);
    });
  });

  $scope.$on('ips.gameFirewall.display.firewall', () => {
    getFirewall();
  });

  $scope.$on('ips.gameFirewall.display', (event, params) => {
    self.datas.selectedBlock = params.ipBlock.ipBlock;
    self.datas.selectedIp = params.ip.ip;
    self.datas.firewall = params.firewall;
    init();
  });

  $scope.$on('$destroy', () => {
    IpGameFirewall.killPollRuleState();
  });

  $scope.onPaginationChange = ({ offset, pageSize }) => {
    $scope.pageSize = pageSize;
    $scope.pageNumber = 1 + Math.floor((offset - 1) / pageSize);
    $scope.offset = 1 + ($scope.pageNumber - 1) * $scope.pageSize;
    $location.search('page', $scope.pageNumber);
    $location.search('pageSize', $scope.pageSize);
    paginate(pageSize, offset);
  };
}
