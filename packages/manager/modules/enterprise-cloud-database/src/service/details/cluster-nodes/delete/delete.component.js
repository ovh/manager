import controller from './delete.controller';
import template from './delete.html';

const component = {
  template,
  controller,
  bindings: {
    clusterId: '<',
    goBackToClusterSize: '<',
    hosts: '<',
  },
};

export default component;
