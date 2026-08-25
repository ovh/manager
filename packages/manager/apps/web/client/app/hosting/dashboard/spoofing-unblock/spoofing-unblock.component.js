import template from './spoofing-unblock.html';
import controller from './spoofing-unblock.controller';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    setMessage: '<',
  },
  template,
  controller,
};
