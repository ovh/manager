import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    clusterId: '<',
    instanceId: '<',
  },
  controller,
  template,
};

export default component;
