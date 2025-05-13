import controller from './failover.controller';
import template from './failover.template.html';

export default {
  bindings: {
    badges: '<',
    goToAntispam: '<',
    goToFailover: '<',
    goToFirewall: '<',
    goToGameFirewall: '<',
    goToOrganisation: '<',
    orderIpAvailable: '<',
    serviceType: '<',
    trackClick: '<',
    trackPage: '<',
    trackingData: '<',
    unusedFilter: '<',
    goToStatistics: '<',
  },
  controller,
  template,
};
