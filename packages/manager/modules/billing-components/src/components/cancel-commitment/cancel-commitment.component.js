import controller from './cancel-commitment.controller';
import template from './cancel-commitment.html';

export default {
  bindings: {
    goBack: '<',
    serviceId: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
