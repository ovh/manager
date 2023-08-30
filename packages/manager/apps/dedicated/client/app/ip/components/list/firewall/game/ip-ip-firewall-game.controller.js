import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import startCase from 'lodash/startCase';

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
    PORT_MIN: 1,
    PORT_MAX: 65535,
    PORT_PATTERN: /^[0-9]*$/,
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
  self.displayAddRuleLine = false;

  self.enums = {
    protocols: [],
  };

  self.rule = {
    protocol: null,
    ports: {
      to: null,
      from: null,
    },
  };

  self.loading = false;

  self.getProtocoleText = function getProtocoleText(protocol) {
    return startCase(protocol);
  };

  self.enums = {
    protocols: [],
  };

  self.rule = {
    protocol: null,
    ports: {
      to: null,
      from: null,
    },
  };

  self.loading = false;

  self.getProtocoleText = function getProtocoleText(protocol) {
    return startCase(protocol);
  };
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
              paginate(self.pageSize, self.offset);
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
    self.pageNumber = 1;
    self.pageSize = self.constantes.PAGE_SIZE_MIN;
    self.pageSizeMax = self.constantes.PAGE_SIZE_MAX;
    self.offset = 1 + (self.pageNumber - 1) * self.pageSize;
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
    paginate(self.pageSize, self.offset);
  }

  function removeRule(ruleId) {
    self.table.rules = remove(
      self.table.rules,
      (ruleToDrop) => ruleToDrop.id !== ruleId,
    );
    paginate(self.pageSize, self.offset);
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
    paginate(self.pageSize, self.offset);

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

  self.onPaginationChange = ({ offset, pageSize }) => {
    self.pageSize = pageSize;
    self.pageNumber = 1 + Math.floor((offset - 1) / pageSize);
    self.offset = 1 + (self.pageNumber - 1) * self.pageSize;
    $location.search('page', self.pageNumber);
    $location.search('pageSize', self.pageSize);
    paginate(pageSize, offset);
  };

  self.addRuleClick = () => {
    self.loading = true;

    // Reset fields
    self.rule = {
      protocol: null,
      ports: {
        to: null,
        from: null,
      },
    };

    // Load protocol list
    self.loadProtocols();

    self.displayAddRuleLine = true;
  };

  self.loadProtocols = () => {
    // Load protocol list
    Ip.getIpModels()
      .then(
        (model) => {
          self.enums.protocols =
            model['ip.GameMitigationRuleProtocolEnum'].enum;
        },
        () => {
          Alerter.error(
            $translate.instant('ip_game_mitigation_rule_add_init_error'),
            alert,
          );
          self.loading = false;
        },
      )
      .finally(() => {
        self.loading = false;
      });
  };

  self.addGameFirewallRule = function addGameFirewallRule() {
    self.loading = true;

    if (!self.rule.ports.to) {
      self.rule.ports.to = self.rule.ports.from;
    }

    if (self.rule.ports.to < self.rule.ports.from) {
      const inversePort = {
        to: self.rule.ports.from,
        from: self.rule.ports.to,
      };
      self.rule.ports = inversePort;
    }

    // Check if ports are valid
    if (
      self.rule.ports.from === undefined ||
      self.rule.ports.to === undefined
    ) {
      Alerter.error(
        $translate.instant('ip_game_mitigation_rule_add_invalid_parameters'),
        alert,
      );
      self.loading = false;
      return;
    }

    IpGameFirewall.postRule(
      self.datas.selectedBlock,
      self.datas.selectedIp,
      self.rule,
    ).then(
      (rule) => {
        $rootScope.$broadcast('ips.gameFirewall.display.add', rule);
        self.displayAddRuleLine = false;
        self.loading = false;
      },
      (data) => {
        Alerter.error(
          $translate.instant('ip_game_mitigation_rule_add_error', {
            message: data.message,
          }),
          alert,
        );
        self.loading = false;
      },
    );
  };

  self.cancel = function cancel() {
    self.displayAddRuleLine = false;
  };

  self.editRule = (rule) => {
    // Load protocols
    self.loading = true;
    self.loadProtocols();

    const index = findIndex(self.table.rules, { id: rule.id });
    self.table.rules[index].isEditable = true;
    self.editRule = self.table.rules[index];
  };

  self.cancelUpdateRule = (rule) => {
    const index = findIndex(self.table.rules, { id: rule.id });
    self.table.rules[index].isEditable = false;
  };

  self.applyUpdateRule = (rule) => {
    // First, remove rule
    IpGameFirewall.deleteRule(
      self.datas.selectedBlock,
      self.datas.selectedIp,
      rule.id,
    ).then(() => {
      const index = findIndex(self.table.rules, { id: rule.id });
      self.table.rules[index].isEditable = false;

      changeStateRule(rule.id, self.constantes.DELETE_RULE_PENDING);

      IpGameFirewall.pollRuleState(
        self.datas.selectedBlock,
        self.datas.selectedIp,
        rule.id,
      ).then(() => {
        removeRule(rule.id);

        // Then create rule
        self.rule = {
          protocol: null,
          ports: {
            to: null,
            from: null,
          },
        };
        self.rule.ports.from = rule.ports.from;
        if (!rule.ports.to) {
          self.rule.ports.to = rule.ports.from;
        } else {
          self.rule.ports.to = rule.ports.to;
        }
        self.rule.protocol = rule.protocol;
        self.addGameFirewallRule();
      });
    });
  };
}
