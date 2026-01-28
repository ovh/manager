import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    goToReplications: '<',
    params: '<',
  },
  controller,
  template,
};
