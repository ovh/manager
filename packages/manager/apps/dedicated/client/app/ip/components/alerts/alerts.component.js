import controller from './alerts.controller';
import template from './alerts.template.html';

export default {
  bindings: {
    serviceType: '<',
  },
  controller,
  template,
};
