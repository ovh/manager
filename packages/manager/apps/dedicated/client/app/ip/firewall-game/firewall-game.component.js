import controller from './firewall-game.controller';
import template from './firewall-game.html';

export default {
  bindings: {
    goToDashboard: '<',
    goToRuleAdd: '<',
    goToRuleDelete: '<',
    goToToggle: '<',
    ip: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
