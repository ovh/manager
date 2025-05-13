export default () =>
  function ipFirewallRulePortFilter(port) {
    return (port && port.replace(/^eq /, '')) || '';
  };
