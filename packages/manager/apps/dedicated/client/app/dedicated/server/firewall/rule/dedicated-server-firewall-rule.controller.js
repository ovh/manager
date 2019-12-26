import set from 'lodash/set';

angular.module('App').controller('ServerFirewallAddRuleCtrl', [
  '$scope',
  '$translate',
  'Server',
  'FIREWALL_RULE_ACTIONS',
  'FIREWALL_RULE_PROTOCOLS',
  'REGEX',

  function ServerFirewallAddRuleCtrl(
    $scope,
    $translate,
    Server,
    firewallRuleActions,
    firewallRuleProtocols,
    regex,
  ) {
    $scope.data = $scope.currentActionData;

    $scope.firewallRuleProtocols = firewallRuleProtocols;

    $scope.rule = {
      sequence: null,
      action: null,
      protocol: null,
      source: null,
      sourcePort: {
        to: null,
        from: null,
      },
      destinationPort: {
        to: null,
        from: null,
      },
      tcpOptions: {
        ack: false,
        established: false,
        fin: false,
        psh: false,
        rst: false,
        syn: false,
        urg: false,
      },
      udpOptions: {
        fragments: false,
      },
    };

    /* Select list */

    $scope.getAvailableSequences = function getAvailableSequences() {
      const sequences = [];
      let i = 0;
      for (; i < 100; i += 1) {
        sequences.push(i);
      }
      return sequences;
    };

    $scope.getAvailableActions = function getAvailableActions() {
      return [firewallRuleActions.ALLOW, firewallRuleActions.DENY];
    };

    $scope.getAvailableProtocols = function getAvailableProtocols() {
      return [
        firewallRuleProtocols.IPV_4,
        firewallRuleProtocols.UDP,
        firewallRuleProtocols.TCP,
        firewallRuleProtocols.ICMP,
      ];
    };

    /* Conditions */

    $scope.isIpv4IcmpOrUdpFrag = function isIpv4IcmpOrUdpFrag() {
      return (
        $scope.rule.protocol === firewallRuleProtocols.IPV_4 ||
        $scope.rule.protocol === firewallRuleProtocols.ICMP ||
        ($scope.rule.protocol === firewallRuleProtocols.UDP &&
          $scope.rule.udpOptions.fragments)
      );
    };

    $scope.isDestinationPortToDisabled = function isDestinationPortToDisabled() {
      return (
        $scope.rule.protocol !== firewallRuleProtocols.TCP &&
        $scope.rule.protocol !== firewallRuleProtocols.UDP &&
        $scope.rule.protocol !== firewallRuleProtocols.ICMP
      );
    };

    /* Validator */

    $scope.updateCheckedTcpOptions = function updateCheckedTcpOptions(option) {
      if ($scope.rule.protocol === firewallRuleProtocols.TCP) {
        if (option === 'established') {
          $scope.rule.tcpOptions.ack = false;
          $scope.rule.tcpOptions.rst = false;
        } else if (option === 'ack' || option === 'rst') {
          $scope.rule.tcpOptions.established = false;
        }
      }
    };

    $scope.isValid = function isValid() {
      return (
        $scope.rule.sequence !== null &&
        $scope.rule.action !== null &&
        $scope.rule.protocol !== null &&
        ($scope.rule.source === null ||
          $scope.rule.source === '' ||
          $scope.rule.source.match(regex.ROUTABLE_BLOCK_OR_IP)) &&
        !(
          $scope.rule.protocol === firewallRuleProtocols.TCP &&
          $scope.rule.tcpOptions.established &&
          ($scope.rule.tcpOptions.ack || $scope.rule.tcpOptions.rst)
        )
      );
    };

    /* Step 2 display */

    function getSourcePortRange() {
      if ($scope.rule.sourcePort.from) {
        if ($scope.rule.sourcePort.to) {
          return `${$scope.rule.sourcePort.from}-${$scope.rule.sourcePort.to}`;
        }
        return $scope.rule.sourcePort.from;
      }
      return '-';
    }

    function getDestinationPortRange() {
      if ($scope.rule.destinationPort.from) {
        if ($scope.rule.destinationPort.to) {
          return `${$scope.rule.destinationPort.from}-${$scope.rule.destinationPort.to}`;
        }
        return $scope.rule.destinationPort.from;
      }
      return '-';
    }

    function getTcpOptionsDisplay() {
      const options = [];
      if ($scope.rule.protocol === firewallRuleProtocols.TCP) {
        angular.forEach($scope.rule.tcpOptions, (value, option) => {
          if (value) {
            options.push(option);
          }
        });
        options.sort();
      }
      return options.join('<br>');
    }

    function getUdpOptionsDisplay() {
      const options = [];
      if ($scope.rule.protocol === firewallRuleProtocols.UDP) {
        angular.forEach($scope.rule.udpOptions, (value, option) => {
          if (value) {
            options.push(option);
          }
        });
        options.sort();
      }
      return options.join('<br>');
    }

    $scope.setDisplayPortRanges = function setDisplayPortRanges() {
      $scope.rule.sourcePort.display = getSourcePortRange();
      $scope.rule.destinationPort.display = getDestinationPortRange();
      $scope.rule.tcpOptionsDisplay = getTcpOptionsDisplay();
      $scope.rule.udpOptionsDisplay = getUdpOptionsDisplay();
    };

    /* Action */

    $scope.addRule = function addRule() {
      $scope.resetAction();

      const { protocol } = $scope.rule;

      if (protocol !== firewallRuleProtocols.TCP) {
        delete $scope.rule.protocol.tcpOptions;
      }

      if (protocol !== firewallRuleProtocols.UDP) {
        delete $scope.rule.protocol.udpOptions;
      }

      if (
        protocol !== firewallRuleProtocols.TCP &&
        protocol !== firewallRuleProtocols.UDP
      ) {
        delete $scope.rule.sourcePort;
        delete $scope.rule.destinationPort;
      }

      Server.addFirewallRule(
        $scope.data.block.value.ip,
        $scope.data.ip.ip,
        $scope.rule,
      ).then(
        (data) => {
          set(data, 'type', 'INFO');
          $scope.setMessage(
            $translate.instant(
              'server_configuration_firewall_add_rule_success',
              { t0: $scope.server.name },
            ),
            data,
          );
        },
        (data) => {
          set(data, 'type', 'ERROR');
          $scope.setMessage(
            $translate.instant('server_configuration_firewall_add_rule_fail'),
            data.data,
          );
        },
      );
    };
  },
]);

angular
  .module('App')
  .controller('FirewallRemoveRuleCtrl', ($scope, $translate, Server) => {
    $scope.data = $scope.currentActionData;

    $scope.removeRule = function removeRule() {
      $scope.resetAction();

      Server.removeFirewallRule(
        $scope.data.block.value.ip,
        $scope.data.ip.ip,
        $scope.data.rule.sequence,
      ).then(
        (data) => {
          set(data, 'type', 'INFO');
          $scope.setMessage(
            $translate.instant(
              'server_configuration_firewall_remove_rule_success',
            ),
            data,
          );
        },
        (data) => {
          set(data, 'type', 'ERROR');
          $scope.setMessage(
            $translate.instant(
              'server_configuration_firewall_remove_rule_fail',
            ),
            data,
          );
        },
      );
    };
  });

angular.module('App').controller('ServerIpToggleFirewallCtrl', [
  '$scope',
  '$translate',
  'Server',
  'FIREWALL_STATUSES',

  function ServerIpToggleFirewallCtrl(
    $scope,
    $translate,
    Server,
    firewallStatuses,
  ) {
    $scope.data = $scope.currentActionData;

    $scope.firewallStatuses = firewallStatuses;

    // Hack because the condition in the template wouldn't change depending on the mitigation status
    $scope.translations = {};
    if ($scope.data.ip.firewallStatus === $scope.firewallStatuses.ACTIVATED) {
      $scope.translations.wizardTitle = $translate.instant(
        'server_configuration_firewall_disable_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'server_configuration_firewall_disable_question',
        { t0: $scope.data.ip.ip },
      );
    } else if (
      $scope.data.ip.firewallStatus === $scope.firewallStatuses.DEACTIVATED
    ) {
      $scope.translations.wizardTitle = $translate.instant(
        'server_configuration_firewall_enable_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'server_configuration_firewall_enable_question',
        { t0: $scope.data.ip.ip },
      );
    } else {
      $scope.translations.wizardTitle = $translate.instant(
        'server_configuration_firewall_new_title',
      );
      $scope.translations.wizardQuestion = $translate.instant(
        'server_configuration_firewall_new_question',
        { t0: $scope.data.ip.ip },
      );
    }

    $scope.toggleFirewall = function toggleFirewall() {
      $scope.resetAction();

      let newStatus = $scope.firewallStatuses.NOT_CONFIGURED;

      if ($scope.data.ip.firewallStatus === $scope.firewallStatuses.ACTIVATED) {
        newStatus = $scope.firewallStatuses.DEACTIVATED;
      } else if (
        $scope.data.ip.firewallStatus === $scope.firewallStatuses.DEACTIVATED
      ) {
        newStatus = $scope.firewallStatuses.ACTIVATED;
      }

      if (newStatus === $scope.firewallStatuses.NOT_CONFIGURED) {
        Server.createFirewall($scope.data.block.ip, $scope.data.ip.ip).then(
          (data) => {
            set(data, 'type', 'INFO');
            $scope.setMessage(
              $translate.instant('server_configuration_firewall_new_success', {
                t0: $scope.data.ip.ip,
              }),
              data,
            );
          },
          (data) => {
            set(data, 'type', 'ERROR');
            $scope.setMessage(
              $translate.instant('server_configuration_firewall_new_failed', {
                t0: $scope.data.ip.ip,
              }),
              data,
            );
          },
        );
      } else {
        Server.toggleFirewall(
          $scope.data.block.ip,
          $scope.data.ip.ip,
          newStatus,
        ).then(
          (data) => {
            set(data, 'type', 'INFO');
            if (newStatus === $scope.firewallStatuses.DEACTIVATED) {
              $scope.setMessage(
                $translate.instant(
                  'server_configuration_firewall_disable_success',
                  { t0: $scope.data.ip.ip },
                ),
                data,
              );
            } else if (newStatus === $scope.firewallStatuses.ACTIVATED) {
              $scope.setMessage(
                $translate.instant(
                  'server_configuration_firewall_enable_success',
                  { t0: $scope.data.ip.ip },
                ),
                data,
              );
            } else {
              $scope.setMessage(
                $translate.instant(
                  'server_configuration_firewall_new_success',
                  { t0: $scope.data.ip.ip },
                ),
                data,
              );
            }
          },
          (data) => {
            set(data, 'type', 'ERROR');
            if (newStatus === $scope.firewallStatuses.DEACTIVATED) {
              $scope.setMessage(
                $translate.instant(
                  'server_configuration_firewall_disable_failed',
                  { t0: $scope.data.ip.ip },
                ),
                data,
              );
            } else if (newStatus === $scope.firewallStatuses.ACTIVATED) {
              $scope.setMessage(
                $translate.instant(
                  'server_configuration_firewall_enable_failed',
                  { t0: $scope.data.ip.ip },
                ),
                data,
              );
            } else {
              $scope.setMessage(
                $translate.instant('server_configuration_firewall_new_failed', {
                  t0: $scope.data.ip.ip,
                }),
                data,
              );
            }
          },
        );
      }
    };
  },
]);
