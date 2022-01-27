import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    availableOptions: '<',
    displayAlerterMessage: '<',
    goBack: '<',
    serviceName: '<',
    trackClick: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
