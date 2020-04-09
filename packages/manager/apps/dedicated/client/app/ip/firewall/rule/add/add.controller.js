import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import transform from 'lodash/transform';
import union from 'lodash/union';

export default class {
  /* @ngInject */
  constructor($scope, $translate, Alerter, IpFirewall, Validator) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.IpFirewall = IpFirewall;
    this.Validator = Validator;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.constants = null;
    this.$scope.rule = {};

    this.$scope.validator = {
      required: false,
      source: true,
      sourcePort: true,
      destinationPort: true,
      fragment: true,
    };

    this.$scope.resetOptionField = () => {
      if (this.$scope.rule.protocol !== 'tcp') {
        delete this.$scope.rule.tcpOptions;
      } else {
        if (!this.$scope.rule.tcpOptions) {
          this.$scope.rule.tcpOptions = {};
        }
        this.$scope.rule.tcpOptions.option = 'NONE';
      }

      if (
        this.$scope.rule.protocol !== 'tcp' &&
        this.$scope.rule.protocol !== 'udp'
      ) {
        delete this.$scope.rule.sourcePort;
        delete this.$scope.rule.destinationPort;
      }
    };

    this.$scope.removeAlert = () => {
      this.Alerter.alertFromSWS(null, null, 'addRuleAlert');
    };

    this.IpFirewall.getFirewallRuleConstants().then((constants) => {
      const sequences = transform(constants.sequences, (result, name, key) => {
        const map = {
          key: name,
          name: parseInt(name.replace('_', ''), 10),
        };
        // eslint-disable-next-line no-param-reassign
        result[key] = map;
      });
      set(constants, 'sequences', sequences);
      set(constants, 'tcpOptions', union(['NONE'], constants.tcpOptions));
      this.$scope.constants = constants;
    });

    this.$scope.isFirewallRuleFormValid = () => {
      const sourceIp = /^(0+\.)+0+$/; // Test only here because it's a firewall specitic case

      // Required field
      this.$scope.validator.required =
        this.$scope.rule.sequence !== undefined &&
        this.$scope.rule.action !== undefined &&
        this.$scope.rule.protocol !== undefined;

      if (this.$scope.rule.source) {
        this.$scope.validator.source =
          (this.Validator.isValidIpv4(this.$scope.rule.source) &&
            !sourceIp.test(this.$scope.rule.source)) ||
          this.Validator.isValidIpv4Block(this.$scope.rule.source);
      } else {
        this.$scope.validator.source = true;
      }

      // sourcePort && destinationPort
      if (
        this.$scope.rule.protocol === 'tcp' ||
        this.$scope.rule.protocol === 'udp'
      ) {
        this.$scope.validator.sourcePort = this.$scope.rule.sourcePort
          ? !Number.isNaN(this.$scope.rule.sourcePort) &&
            !(
              this.$scope.rule.sourcePort < 0 ||
              this.$scope.rule.sourcePort > 65535
            )
          : true;
        this.$scope.validator.destinationPort = this.$scope.rule.destinationPort
          ? !Number.isNaN(this.$scope.rule.destinationPort) &&
            !(
              this.$scope.rule.destinationPort < 0 ||
              this.$scope.rule.destinationPort > 65535
            )
          : true;
      } else {
        this.$scope.validator.sourcePort = true;
        this.$scope.validator.destinationPort = true;
      }

      // Fragment
      if (
        this.$scope.rule.tcpOptions &&
        this.$scope.rule.tcpOptions.fragments === true &&
        this.$scope.rule.protocol === 'tcp'
      ) {
        this.$scope.validator.fragment =
          (this.$scope.rule.sourcePort == null ||
            this.$scope.rule.sourcePort === '') &&
          (this.$scope.rule.destinationPort == null ||
            this.$scope.rule.destinationPort === '');
      } else {
        this.$scope.validator.fragment = true;
      }

      return (
        this.$scope.validator.required &&
        this.$scope.validator.source &&
        this.$scope.validator.sourcePort &&
        this.$scope.validator.destinationPort &&
        this.$scope.validator.fragment
      );
    };

    this.$scope.addRule = () => {
      this.$scope.loading = true;

      // set empty string to null values to avoid API error
      this.$scope.rule.source = isEmpty(
        get(this.$scope.rule, 'source', '').trim(),
      )
        ? null
        : this.$scope.rule.source;
      this.$scope.rule.sourcePort = isEmpty(
        get(this.$scope.rule, 'sourcePort', '').trim(),
      )
        ? null
        : this.$scope.rule.sourcePort;
      this.$scope.rule.destinationPort = isEmpty(
        get(this.$scope.rule, 'destinationPort', '').trim(),
      )
        ? null
        : this.$scope.rule.destinationPort;

      this.IpFirewall.addFirewallRule(this.ipBlock, this.ip, this.$scope.rule)
        .then(() => this.goBack({}, { reload: true }))
        .catch((data) => {
          this.$scope.loading = false;
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_firewall_add_rule_fail'),
            data.data,
            'addRuleAlert',
          );
        });
    };
  }
}
