import controller from './list.controller';
import template from './list.html';

export default {
  bindings: {
    badges: '<',
    goToAntispam: '<',
    goToFirewall: '<',
    goToGameFirewall: '<',
    goToOrganisation: '<',
    orderIpAvailable: '<',
    serviceType: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
