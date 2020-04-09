import controller from './toggle.controller';
import template from './toggle.html';

export default {
  bindings: {
    firewall: '<',
    goBack: '<',
    ip: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
