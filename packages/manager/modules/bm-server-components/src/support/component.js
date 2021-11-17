import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '@',
    travauxUrl: '@',
    viewInterventionsUrl: '@',
    trackingPrefix: '<',
  },
  controller,
  template,
};
