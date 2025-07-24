import controller from './config-enhanced.controller';
import template from './config-enhanced.html';

export default {
  controller,
  template,
  controllerAs: 'ConfigWifiEnhancedCtrl',
  bindings: {
    serviceName: '<',
    canChangeWifiRadio: '<',
    canChangeWifiSsid: '<',
  },
};
