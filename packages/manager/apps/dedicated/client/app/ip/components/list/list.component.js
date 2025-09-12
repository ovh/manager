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
    goToVrack: '<',
    onParamDeleted: '&',
    orderIpAvailable: '<',
    params: '<',
    serviceType: '<',
    isAdditionalIp: '<',
    setAction: '<',
    trackClick: '<',
    trackPage: '<',
    trackingData: '<',
    goToStatistics: '<',
    isDeleteByoipServiceAvailable: '<',
    goToDeleteIpService: '<',
  },
  transclude: {
    actions: '?ipListActions',
    filters: '?ipListFilters',
    header: '?ipListHeader',
  },
  controller,
  template,
};
