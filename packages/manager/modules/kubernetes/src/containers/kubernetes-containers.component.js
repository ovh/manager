import controller from './kubernetes-containers.controller';
import template from './kubernetes-containers.html';

const component = {
  bindings: {
    serviceName: '@',
  },
  controller,
  template,
};

export default component;
