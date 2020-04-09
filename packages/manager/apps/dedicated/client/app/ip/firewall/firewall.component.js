import controller from './firewall.controller';
import template from './firewall.html';

export default {
  bindings: {
    goToDashboard: '<',
    goToFirewallRuleAdd: '<',
    goToFirewallRuleDelete: '<',
    ip: '<',
    ipBlock: '<',
    serviceName: '<',
  },
  controller,
  template,
};
