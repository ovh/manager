import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    serviceName: '@',
  },
  template,
  controller,
};

export default component;
