import controller from './cancel-resiliation.controller';
import template from './cancel-resiliation.html';

export default {
  bindings: {
    cancelResiliation: '<',
    goBack: '<',
    service: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
