import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import transform from 'lodash/transform';
import union from 'lodash/union';

export default /* @ngInject */ (
  $scope,
  $rootScope,
  $translate,
  Ip,
  IpFirewall,
  Alerter,
  Validator,
) => {
  $scope.data = $scope.currentActionData;
  $scope.constants = null;
  $scope.rule = {};

  $scope.validator = {
    required: false,
    source: true,
    sourcePort: true,
    destinationPort: true,
    fragment: true,
  };

  $scope.resetOptionField = function resetOptionField() {
    if ($scope.rule.protocol !== 'tcp') {
      delete $scope.rule.tcpOptions;
    } else {
      if (!$scope.rule.tcpOptions) {
        $scope.rule.tcpOptions = {};
      }
      $scope.rule.tcpOptions.option = 'NONE';
    }

    if ($scope.rule.protocol !== 'tcp' && $scope.rule.protocol !== 'udp') {
      delete $scope.rule.sourcePort;
      delete $scope.rule.destinationPort;
    }
  };

  $scope.removeAlert = function removeAlert() {
    Alerter.alertFromSWS(null, null, 'addRuleAlert');
  };

  IpFirewall.getFirewallRuleConstants().then((constants) => {
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
    $scope.constants = constants;
  });

  $scope.isFirewallRuleFormValid = function isFirewallRuleFormValid() {
    const sourceIp = /^(0+\.)+0+$/; // Test only here because it's a firewall specitic case

    // Required field
    $scope.validator.required =
      $scope.rule.sequence !== undefined &&
      $scope.rule.action !== undefined &&
      $scope.rule.protocol !== undefined;

    if ($scope.rule.source) {
      $scope.validator.source =
        (Validator.isValidIpv4($scope.rule.source) &&
          !sourceIp.test($scope.rule.source)) ||
        Validator.isValidIpv4Block($scope.rule.source);
    } else {
      $scope.validator.source = true;
    }

    // sourcePort && destinationPort
    if ($scope.rule.protocol === 'tcp' || $scope.rule.protocol === 'udp') {
      $scope.validator.sourcePort = $scope.rule.sourcePort
        ? !Number.isNaN($scope.rule.sourcePort) &&
          !($scope.rule.sourcePort < 0 || $scope.rule.sourcePort > 65535)
        : true;
      $scope.validator.destinationPort = $scope.rule.destinationPort
        ? !Number.isNaN($scope.rule.destinationPort) &&
          !(
            $scope.rule.destinationPort < 0 ||
            $scope.rule.destinationPort > 65535
          )
        : true;
    } else {
      $scope.validator.sourcePort = true;
      $scope.validator.destinationPort = true;
    }

    // Fragment
    if (
      $scope.rule.tcpOptions &&
      $scope.rule.tcpOptions.fragments === true &&
      $scope.rule.protocol === 'tcp'
    ) {
      $scope.validator.fragment =
        ($scope.rule.sourcePort == null || $scope.rule.sourcePort === '') &&
        ($scope.rule.destinationPort == null ||
          $scope.rule.destinationPort === '');
    } else {
      $scope.validator.fragment = true;
    }

    return (
      $scope.validator.required &&
      $scope.validator.source &&
      $scope.validator.sourcePort &&
      $scope.validator.destinationPort &&
      $scope.validator.fragment
    );
  };

  $scope.addRule = function addRule() {
    $scope.loading = true;

    // set empty string to null values to avoid API error
    $scope.rule.source = isEmpty(get($scope.rule, 'source', '').trim())
      ? null
      : $scope.rule.source;
    $scope.rule.sourcePort = isEmpty(get($scope.rule, 'sourcePort', '').trim())
      ? null
      : $scope.rule.sourcePort;
    $scope.rule.destinationPort = isEmpty(
      get($scope.rule, 'destinationPort', '').trim(),
    )
      ? null
      : $scope.rule.destinationPort;

    IpFirewall.addFirewallRule(
      $scope.data.ipBlock,
      $scope.data.ip,
      $scope.rule,
    ).then(
      (data) => {
        $rootScope.$broadcast('ips.firewall.informations.reload', data);
        $scope.resetAction();
      },
      (data) => {
        $scope.loading = false;
        Alerter.alertFromSWS(
          $translate.instant('ip_firewall_add_rule_fail'),
          data.data,
          'addRuleAlert',
        );
      },
    );
  };
};
