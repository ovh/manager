import controller from './service-status.controller';
import template from './service-status.html';

export default {
  bindings: {
    server: '<',
    dedicatedServer: '<',
    trackingPrefix: '<',
    infoServer: '<',
    terminateLink: '<',
    monitoringProtocolEnum: '<',
    serviceMonitoring: '<',
    ola: '<',
    goToMonitoringUpdate: '<',
    isMonitoringOptionsAvailable: '<',
  },
  controller,
  template,
};
