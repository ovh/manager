angular.module('Module.ip.filters').filter('ipFirewallRulePort', () => function (port) {
  return (port && port.replace(/^eq /, '')) || '';
});
