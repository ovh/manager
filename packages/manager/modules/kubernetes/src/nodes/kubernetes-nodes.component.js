import controller from './kubernetes-nodes.controller';
import template from './kubernetes-nodes.html';

const component = {
  bindings: {
    serviceName: '@',
  },
  template,
  controller,
};

export default component;
