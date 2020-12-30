import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    serviceType: '<',
  },
  controller,
  template,
};
