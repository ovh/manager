import startCase from 'lodash/startCase';

import { IP_MITIGIATION_RULE_PROTOCOL_GAMES } from '../../firewall-game.constants';

export default class {
  /* @ngInject */
  constructor($scope, $translate, Alerter, Ip, IpGameFirewall) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Ip = Ip;
    this.IpGameFirewall = IpGameFirewall;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.alertadd = 'ip_game_firewall_add_alert';

    this.forms = {
      addRuleForm: {},
    };

    this.enums = {
      protocols: [],
    };

    this.rule = {
      protocol: null,
      ports: {
        to: null,
        from: null,
      },
    };

    this.$scope.addRuleFormCheck = {
      formValid: false,
    };

    this.loading = false;

    this.$scope.getProtocoleText = (protocol) => {
      return (
        IP_MITIGIATION_RULE_PROTOCOL_GAMES[protocol] || startCase(protocol)
      );
    };

    this.$scope.addGameFirewallRule = () => {
      this.loading = true;

      if (this.rule.ports.to === null) {
        this.rule.ports.to = this.rule.ports.from;
      }

      if (this.rule.ports.to < this.rule.ports.from) {
        const inversePort = {
          to: this.rule.ports.from,
          from: this.rule.ports.to,
        };
        this.rule.ports = inversePort;
      }

      this.IpGameFirewall.postRule(this.ipBlock, this.ip, this.rule)
        .then(() => this.goBack({}, { reload: true }))
        .catch((data) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_game_mitigation_rule_add_error'),
            data,
            this.alertadd,
          );
          this.loading = false;
        });
    };

    this.$scope.getClassLabel = (label) => {
      if (label && label.$dirty) {
        return (label.$invalid && 'has-error') || 'has-success';
      }

      return '';
    };

    this.init();
  }

  init() {
    this.loading = true;

    this.Ip.getIpModels()
      .then((model) => {
        this.enums.protocols = model['ip.GameMitigationRuleProtocolEnum'].enum;
      })
      .catch((data) =>
        this.goBack({
          message: {
            text: this.$translate.instant(
              'ip_game_mitigation_rule_add_init_error',
            ),
            data: {
              ...data,
              type: 'ERROR',
            },
          },
        }),
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
