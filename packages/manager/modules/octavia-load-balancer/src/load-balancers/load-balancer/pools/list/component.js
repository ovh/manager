import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    pools: '<',
    goToPoolCreation: '<',
    goToPoolDeletion: '<',
  },
  controller,
  template,
};
