import controller from './service-status.controller';
import template from './service-status.html';
import './service-status.scss';

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
    serverType: '<',
  },
  controller,
  template,
};
