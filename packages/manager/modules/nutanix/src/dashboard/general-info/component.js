import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    technicalDetails: '<',
    cluster: '<',
    serviceInfo: '<',
    user: '<',
  },
  controller,
  template,
};
