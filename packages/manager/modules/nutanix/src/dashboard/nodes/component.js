import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    cluster: '<',
    nodes: '<',
  },
  controller,
  template,
};
