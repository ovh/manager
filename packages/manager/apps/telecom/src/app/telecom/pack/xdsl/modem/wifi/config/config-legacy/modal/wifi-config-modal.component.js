import controller from './wifi-config-modal.controller';
import template from './wifi-config-modal.html';

export default {
  bindings: {
    serviceName: '<',
    wifiName: '<',
    ssid: '<',
    goBack: '<',
  },
  controller,
  template,
};
