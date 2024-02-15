import isObject from 'lodash/isObject';
import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import startCase from 'lodash/startCase';

import {
  IP_MITIGATION_RULE_PROTOCOL_PORT,
  ALLOWED_LANGUAGES,
  BASE_URL_SURVEY,
  GAME_GUIDE_LINKS,
  GAME_TRACKING_PREFIX,
} from './ip-ip-firewall-game.constants';

export default /* @ngInject */ function IpGameFirewallCtrl(
  $location,
  $scope,
  $rootScope,
  $translate,
  getIp,
  goToDashboard,
  Ip,
  IpGameFirewall,
  Alerter,
  $q,
  coreConfig,
  atInternet,
) {
  const self = this;
  const alert = 'ip_game_firewall_alert';

  self.goToDashboard = goToDashboard;
  self.getIp = getIp;

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

  self.gameGuideLink =
    GAME_GUIDE_LINKS[coreConfig.getUser().ovhSubsidiary] ||
    GAME_GUIDE_LINKS.DEFAULT;

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

  function initializeUrlSurvey() {
    // Get default language
    const defaultLanguage = Object.keys(ALLOWED_LANGUAGES).find(
      (key) => ALLOWED_LANGUAGES[key].isDefault,
    );
    const userLanguage = coreConfig.getUserLanguage();

    const languageToUse = isObject(ALLOWED_LANGUAGES[userLanguage])
      ? userLanguage
      : defaultLanguage;

    // Get user
    const user = coreConfig.getUser();

    // Build url for survey link
    const surveyUrl = `${BASE_URL_SURVEY}${languageToUse}&nic=${user.nichandle}`;
    return surveyUrl;
  }

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
                if (self.table.rules.length > 0) {
                  if (findIndex(self.table.rules, { id: ruleId }) === -1) {
                    self.table.rules.push(rule);
                  }
                } else {
                  self.table.rules.push(rule);
                }
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

  function init(params) {
    self.surveyUrl = initializeUrlSurvey();

    self.tracking = {
      'game-firewall-add-rule': `${GAME_TRACKING_PREFIX}::add-rule`,
      'game-firewall-add-rule-confirm': `${GAME_TRACKING_PREFIX}::add-rule-confirm`,
      'game-firewall-add-rule-cancel': `${GAME_TRACKING_PREFIX}::add-rule-cancel`,
      'game-firewall-delete-rule': `${GAME_TRACKING_PREFIX}::delete-rule`,
      'apply-default-policy': `${GAME_TRACKING_PREFIX}::default-policy-drop`,
    };

    if (params) {
      self.datas.selectedBlock = params.ipBlock.ipBlock;
      self.datas.selectedIp = params.ip.ip;
      getFirewall();
      getRules();
    } else {
      self.datas.selectedIp = self.getIp();
      IpGameFirewall.getIpdBlock(self.datas.selectedIp).then((data) => {
        if (data.length) {
          [self.datas.selectedBlock] = data;
          getFirewall();
          getRules();
        }
      });
    }

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

  function hasPortsAlreadyUsed() {
    return self.table.rules.some((rule) => {
      // Check if other rule has no range
      if (rule.ports.from === rule.ports.to) {
        // Check if new rule has no range
        if (self.rule.ports.from === self.rule.ports.to) {
          // Check if new rule is not already defined
          if (self.rule.ports.from === rule.ports.from) {
            return true;
          }
        } else if (IpGameFirewall.hasRuleIncludedInNewRule(self.rule, rule)) {
          // Check if other rule is not included into new rule
          return true;
        }
      } else if (self.rule.ports.from === self.rule.ports.to) {
        // Check if new rule has no range
        if (IpGameFirewall.hasNewRuleIncludedInRule(self.rule, rule)) {
          // Check if new rule is not included into other rule
          return true;
        }
      } else if (
        IpGameFirewall.hasNewRuleIntoRule(self.rule, rule) ||
        IpGameFirewall.hasNewRulePortToIntoRule(self.rule, rule) ||
        IpGameFirewall.hasNewRulePortFromIntoRule(self.rule, rule) ||
        IpGameFirewall.hasRuleIntoNewRule(self.rule, rule)
      ) {
        // Check if the new rule is not into other rules or
        // Check if the new rule port to is not into other rules or
        // Check if the new rule port from is not into other rules or
        // Check if the rule is not into new rule
        return true;
      }
      return false;
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
    init(params);
  });

  init();

  $scope.$on('$destroy', () => {
    IpGameFirewall.killPollRuleState();
  });

  $scope.$on('ips.gameFirewall.cancelToggle', () => {
    self.firewallModeEnabled = !self.firewallModeEnabled;
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
    atInternet.trackClick({
      name: self.tracking['game-firewall-add-rule'],
      type: 'action',
    });

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
    atInternet.trackClick({
      name: self.tracking['game-firewall-add-rule-confirm'],
      type: 'action',
    });

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
    if (!self.rule.ports.from || !self.rule.ports.to) {
      Alerter.error(
        $translate.instant(
          'ip_game_mitigation_firewall_rule_add_invalid_parameters',
        ),
        alert,
      );
      self.loading = false;
      return;
    }

    // Check if ports are not already used by other rules
    if (hasPortsAlreadyUsed()) {
      Alerter.error(
        $translate.instant(
          'ip_game_mitigation_firewall_rule_add_ports_already_used',
        ),
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
    atInternet.trackClick({
      name: self.tracking['game-firewall-add-rule-cancel'],
      type: 'action',
    });

    self.displayAddRuleLine = false;
  };

  self.selectProtocolDefaultPort = function selectProtocolDefaultPort() {
    // reset ports from and to
    self.rule.ports.from = '';
    self.rule.ports.to = '';

    const defaultPort = IP_MITIGATION_RULE_PROTOCOL_PORT[self.rule.protocol];
    if (defaultPort) {
      self.rule.ports.from = defaultPort.from;
      if (defaultPort.to) {
        self.rule.ports.to = defaultPort.to;
      }
    }
  };

  self.handleKey = function($event) {
    if ($event.keyCode === 13) {
      // Enter key
      self.addGameFirewallRule();
    }
    if ($event.keyCode === 27) {
      // Escape key
      self.cancel();
    }
  };
}
