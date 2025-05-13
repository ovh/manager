import controller from './cdn-flush.controller';
import template from './cdn-flush.html';

export default {
  bindings: {
    cdnProperties: '<',
    domain: '<',
    goBack: '<',
    onFlushSuccess: '<',
    serviceName: '<',
  },
  controller,
  template,
};
