import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    displayAlerterMessage: '<',
    goBack: '<',
    serviceName: '<',
    trackClick: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
