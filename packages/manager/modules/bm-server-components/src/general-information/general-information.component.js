import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    server: '<',
    eligibleData: '<?',
    ola: '<?',
    dedicatedServer: '<',
    trackingPrefix: '<',
    goToNetboot: '<?',
    infoServer: '<',
    serverType: '<',
  },
  controller,
  template,
};
