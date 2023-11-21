import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    pools: '<',
    goToPoolCreation: '<',
    getPoolDetailLink: '<',
    goToPoolDeletion: '<',
  },
  controller,
  template,
};
