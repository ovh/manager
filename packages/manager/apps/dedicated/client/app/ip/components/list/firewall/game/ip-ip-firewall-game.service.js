export default /* @ngInject */ function IpGameFirewallService(
  $http,
  $q,
  constants,
  Poll,
) {
  const swsProxypassPath = 'apiv6/ip';

  this.pollRuleState = function pollRuleState(ipBlock, ip, ruleId) {
    return Poll.poll(
      [
        swsProxypassPath,
        [
          window.encodeURIComponent(ipBlock),
          'game',
          window.encodeURIComponent(ip),
          'rule',
        ].join('/'),
        ruleId,
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.firewallGame' },
    );
  };

  this.pollFirewallState = function pollFirewallState(ipBlock, ip) {
    return Poll.poll(
      [
        swsProxypassPath,
        [
          window.encodeURIComponent(ipBlock),
          'game',
          window.encodeURIComponent(ip),
        ].join('/'),
      ].join('/'),
      null,
      { successRule: { state: 'ok' }, namespace: 'ip.firewallGame' },
    );
  };

  this.killPollRuleState = function killPollRuleState() {
    return Poll.kill({ namespace: 'ip.firewallGame' });
  };

  this.get = function get(ipBlock, ip) {
    return $http
      .get(
        [
          swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
          ].join('/'),
        ].join('/'),
      )
      .then(
        (result) => result.data,
        (http) => $q.reject(http.data),
      );
  };

  this.getRules = function getRules(ipBlock, ip) {
    return $http
      .get(
        [
          swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
        ].join('/'),
      )
      .then(
        (result) => result.data,
        (http) => $q.reject(http.data),
      );
  };

  this.getRule = function getRule(ipBlock, ip, ruleId) {
    return $http
      .get(
        [
          swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
          ruleId,
        ].join('/'),
      )
      .then(
        (result) => result.data,
        (http) => $q.reject(http.data),
      );
  };

  this.postRule = function postRule(ipBlock, ip, rule) {
    return $http
      .post(
        [
          swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
        ].join('/'),
        rule,
      )
      .then(
        (result) => result.data,
        (http) => $q.reject(http.data),
      );
  };

  this.deleteRule = function deleteRule(ipBlock, ip, ruleId) {
    return $http
      .delete(
        [
          swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
            'rule',
          ].join('/'),
          ruleId,
        ].join('/'),
      )
      .then(
        (result) => result.data,
        (http) => $q.reject(http.data),
      );
  };

  this.putFirewall = function putFirewall(ipBlock, ip, enable) {
    return $http
      .put(
        [
          swsProxypassPath,
          [
            window.encodeURIComponent(ipBlock),
            'game',
            window.encodeURIComponent(ip),
          ].join('/'),
        ].join('/'),
        {
          firewallModeEnabled: enable,
        },
      )
      .then(
        (result) => result.data,
        (http) => $q.reject(http.data),
      );
  };

  this.getIpdBlock = function getIpdBlock(ip) {
    return $http.get(`/ip?ip=${window.encodeURIComponent(ip)}`).then(
      (result) => result.data,
      (http) => $q.reject(http.data),
    );
  };

  // Check if the new rule is not into other rules
  // for example:
  // newRule = {from: 4320, to: 4330},
  // rule = {from: 4300, to: 4400}
  this.hasNewRuleIntoRule = function hasNewRuleIntoRule(newRule, rule) {
    return (
      newRule.ports.from > rule.ports.from && newRule.ports.to < rule.ports.to
    );
  };

  // Check if the new rule port to is not into other rules
  // for example:
  // newRule = {from: 4200, to: 4330},
  // rule = {from: 4300, to: 4400}
  this.hasNewRulePortToIntoRule = function hasNewRulePortToIntoRule(
    newRule,
    rule,
  ) {
    return (
      newRule.ports.from < rule.ports.to &&
      newRule.ports.to > rule.ports.from &&
      newRule.ports.to < rule.ports.to
    );
  };

  // Check if the new rule port from is not into other rules
  // for example:
  // newRule = {from: 4300, to: 4500},
  // rule = {from: 4200, to: 4400}
  this.hasNewRulePortFromIntoRule = function hasNewRulePortFromIntoRule(
    newRule,
    rule,
  ) {
    return (
      newRule.ports.from > rule.ports.from &&
      newRule.ports.from < rule.ports.to &&
      newRule.ports.to > rule.ports.to
    );
  };

  // Check if the rule is not into new rule
  // for example:
  // newRule = {from: 4100, to: 4500},
  // rule = {from: 4200, to: 4300}
  this.hasRuleIntoNewRule = function hasRuleIntoNewRule(newRule, rule) {
    return (
      newRule.ports.from < rule.ports.from && newRule.ports.to > rule.ports.to
    );
  };

  // Check if other rule is not included into new rule
  // for example:
  // newRule = {from: 4100 , to: 4300},
  // rule = {from: 4200 , to: 4200}
  this.hasRuleIncludedInNewRule = function hasRuleIncludedInNewRule(
    newRule,
    rule,
  ) {
    return (
      newRule.ports.from < rule.ports.from &&
      newRule.ports.from < rule.ports.to &&
      newRule.ports.to > rule.ports.from &&
      newRule.ports.to > rule.ports.to
    );
  };

  // Check if new rule is not included into other rule
  // newRule = {from: 4200 , to: 4200}
  // rule = {from: 4100 , to: 4300},
  this.hasNewRuleIncludedInRule = function hasNewRuleIncludedInRule(
    newRule,
    rule,
  ) {
    return (
      newRule.ports.from < rule.ports.to && newRule.ports.from > rule.ports.from
    );
  };
}
