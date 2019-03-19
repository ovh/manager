import controller from './kubernetes-service.controller';
import template from './kubernetes-service.html';

const component = {
  bindings: {
    serviceName: '@',
  },
  template,
  controller,
};

export default component;
