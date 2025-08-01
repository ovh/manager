import controller from './config-legacy.controller';
import template from './config-legacy.html';

export default {
  controller,
  template,
  controllerAs: 'ConfigWifiLegacyCtrl',
  bindings: {
    modem: '<',
  },
};
