angular.module('Module.ip.services').service('IpGameFirewall', [
  '$http',
  '$q',
  'constants',
  'Poll',
  function ($http, $q, constants, Poll) {
    const swsProxypassPath = 'apiv6/ip';

    this.pollRuleState = function (ipBlock, ip, ruleId) {
      return Poll.poll([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip), 'rule'].join('/'), ruleId].join('/'), null, { successRule: { state: 'ok' }, namespace: 'ip.firewallGame' });
    };

    this.pollFirewallState = function (ipBlock, ip) {
      return Poll.poll([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip)].join('/')].join('/'), null, { successRule: { state: 'ok' }, namespace: 'ip.firewallGame' });
    };

    this.killPollRuleState = function () {
      return Poll.kill({ namespace: 'ip.firewallGame' });
    };

    this.get = function (ipBlock, ip) {
      return $http.get([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip)].join('/')].join('/')).then(result => result.data, http => $q.reject(http.data));
    };

    this.getRules = function (ipBlock, ip) {
      return $http.get([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip), 'rule'].join('/')].join('/')).then(result => result.data, http => $q.reject(http.data));
    };

    this.getRule = function (ipBlock, ip, ruleId) {
      return $http.get([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip), 'rule'].join('/'), ruleId].join('/')).then(result => result.data, http => $q.reject(http.data));
    };

    this.postRule = function (ipBlock, ip, rule) {
      return $http.post([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip), 'rule'].join('/')].join('/'), rule).then(result => result.data, http => $q.reject(http.data));
    };

    this.deleteRule = function (ipBlock, ip, ruleId) {
      return $http.delete([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip), 'rule'].join('/'), ruleId].join('/')).then(result => result.data, http => $q.reject(http.data));
    };

    this.putFirewall = function (ipBlock, ip, enable) {
      return $http
        .put([swsProxypassPath, [window.encodeURIComponent(ipBlock), 'game', window.encodeURIComponent(ip)].join('/')].join('/'), {
          firewallModeEnabled: enable,
        })
        .then(result => result.data, http => $q.reject(http.data));
    };
  },
]);
