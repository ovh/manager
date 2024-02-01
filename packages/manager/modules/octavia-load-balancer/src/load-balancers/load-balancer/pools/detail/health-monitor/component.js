import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    healthMonitor: '<',
    goToHealthMonitorEdition: '<',
    goToHealthMonitorDeletion: '<',
    goToEditName: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
    trackAction: '<',
  },
  template,
  controller,
};
