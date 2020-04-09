import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';

export default class {
  /* @ngInject */
  constructor($q, $scope, $translate, IpGameFirewall) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpGameFirewall = IpGameFirewall;
  }

  $onInit() {
    this.datas = {
      selectedBlock: this.ipBlock.ipBlock,
      selectedIp: this.ip.ip,
      firewall: null,
    };

    this.constantes = {
      DELETE_RULE_PENDING: 'deleteRulePending',
      OK: 'ok',
    };

    this.table = {
      rules: [],
    };

    this.loaders = {
      firewall: false,
      rules: false,
    };

    this.$scope.$on('$destroy', () => {
      this.IpGameFirewall.killPollRuleState();
    });

    this.init();
  }

  getFirewall() {
    this.loaders.firewall = true;
    this.datas.firewall = null;

    this.IpGameFirewall.get(this.datas.selectedBlock, this.datas.selectedIp)
      .then((firewall) => {
        this.datas.firewall = firewall;

        if (firewall.state !== this.constantes.OK) {
          this.IpGameFirewall.pollFirewallState(
            this.datas.selectedBlock,
            this.datas.selectedIp,
          ).then((_firewall) => {
            this.datas.firewall = _firewall;
          });
        }
      })
      .catch(() => {
        this.datas.firewall = null;
      })
      .finally(() => {
        this.loaders.firewall = false;
      });
  }

  getRules() {
    this.IpGameFirewall.killPollRuleState();
    this.loaders.rules = true;
    this.table.rules = [];
    this.IpGameFirewall.getRules(
      this.datas.selectedBlock,
      this.datas.selectedIp,
    )
      .then((rules) => {
        const tablePromise = [];
        angular.forEach(rules, (ruleId) => {
          tablePromise.push(
            this.getRule(ruleId).then(
              (rule) => {
                this.table.rules.push(rule);
              },
              (error) => {
                this.table.rules.push({
                  errorMessage: this.$translate.instant(
                    'ip_game_mitigation_table_partial_error_info',
                    { t0: ruleId },
                  ),
                });
                return this.$q.reject(error);
              },
            ),
          );
        });

        if (tablePromise.length > 0) {
          this.$q
            .allSettled(tablePromise)
            .then(
              () => {
                // nothing
              },
              () =>
                this.goToFirewallGame({
                  message: {
                    text: this.$translate.instant(
                      'ip_game_mitigation_table_partial_error',
                    ),
                    data: 'ERROR',
                  },
                }),
            )
            .finally(() => {
              this.loaders.rules = false;
            });
        } else {
          this.loaders.rules = false;
        }
      })
      .catch(() => {
        this.table.rules = null;
        this.loaders.rules = false;
      });
  }

  init() {
    this.getFirewall();
    this.getRules();
  }

  changeStateRule(ruleId, state) {
    const index = findIndex(this.table.rules, { id: ruleId });
    if (
      index >= 0 &&
      index < this.table.rules.length &&
      this.table.rules[index]
    ) {
      this.table.rules[index].state = state;
    }
  }

  removeRule(ruleId) {
    this.table.rules = remove(
      this.table.rules,
      (ruleToDrop) => ruleToDrop.id !== ruleId,
    );
  }

  getRule(ruleId) {
    return this.IpGameFirewall.getRule(
      this.datas.selectedBlock,
      this.datas.selectedIp,
      ruleId,
    ).then((rule) => {
      if (rule.state !== this.constantes.OK) {
        this.IpGameFirewall.pollRuleState(
          this.datas.selectedBlock,
          this.datas.selectedIp,
          ruleId,
        ).then((rulePoll) => {
          switch (rulePoll.state) {
            case this.constantes.DELETE_RULE_PENDING:
              this.removeRule(ruleId);
              break;
            default:
              this.changeStateRule(ruleId, rulePoll.state);
              break;
          }
        });
      }
      return rule;
    });
  }

  refreshRules() {
    this.getRules();
  }

  hideGameFirewall() {
    return this.goToDashboard(
      { serviceName: this.serviceName },
      { reload: true },
    );
  }
}
