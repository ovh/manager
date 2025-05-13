import controller from './controller';
import template from './template.html';

const component = {
  controller,
  template,
  bindings: {
    serviceName: '<',
  },
};

export default component;
