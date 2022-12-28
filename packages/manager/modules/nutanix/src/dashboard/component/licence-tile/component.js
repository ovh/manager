import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    serviceId: '<',
    licenceName: '<',
    onError: '&?',
  },
  controller,
  template,
};
