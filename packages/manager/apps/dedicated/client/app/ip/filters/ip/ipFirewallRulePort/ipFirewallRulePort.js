angular.module('Module.ip.filters').filter(
  'ipFirewallRulePort',
  () =>
    function ipFirewallRulePortFilter(port) {
      return (port && port.replace(/^eq /, '')) || '';
    },
);
