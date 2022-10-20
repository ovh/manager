import template from './upgrade.html';
import controller from './upgrade.controller';

export default {
  template,
  controller,
  bindings: {
    serviceName: '<',
    vpsLinkedDisk: '<',
    upgradableDisks: '<',
    goBack: '<',
  },
};
