import controller from './firewall-toggle.controller';
import template from './firewall-toggle.html';

export default {
  bindings: {
    goBack: '<',
    ip: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
