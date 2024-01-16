import controller from './service-status.controller';
import template from './service-status.html';

export default {
  bindings: {
    server: '<',
    dedicatedServer: '<',
    trackingPrefix: '<',
    infoServer: '<',
    terminateLink: '<',
    ola: '<',
    goToMonitoringUpdate: '<',
    isMonitoringOptionsAvailable: '<',
    serverIsNode: '<',
  },
  controller,
  template,
};
