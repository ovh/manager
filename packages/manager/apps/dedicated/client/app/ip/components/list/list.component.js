import controller from './list.controller';
import template from './list.html';
import './list.styles.scss';

export default {
  bindings: {
    badges: '<',
    goToAntispam: '<',
    goToFirewall: '<',
    goToGameFirewall: '<',
    goToOrganisation: '<',
    orderIpAvailable: '<',
    serviceType: '<',
    setAction: '<',
    trackClick: '<',
    trackPage: '<',
    trackingData: '<',
  },
  transclude: {
    actions: '?ipListActions',
    filters: '?ipListFilters',
  },
  controller,
  template,
};
