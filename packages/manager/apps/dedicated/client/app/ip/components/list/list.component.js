import controller from './list.controller';
import template from './list.html';

export default {
  bindings: {
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
