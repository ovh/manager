import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    serviceName: '@',
  },
  controller,
  template,
};

export default component;
