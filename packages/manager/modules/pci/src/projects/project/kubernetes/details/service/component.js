import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    serviceName: '@',
    cluster: '<',
  },
  template,
  controller,
};

export default component;
