import controller from './antispam.controller';
import template from './antispam.html';

export default {
  bindings: {
    goToAntispam: '<',
    goToDashboard: '<',
    goToDetail: '<',
    ip: '<',
    ipSpamming: '<',
    serviceName: '<',
  },
  controller,
  template,
};
