import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    lineNumber: '@',
    serviceName: '@',
  },
  template,
  controller,
};
