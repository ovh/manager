import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    trackClick: '<',
    trackSuccess: '<',
    trackError: '<',
    vrackServices: '<',
    vracks: '<',
    createVrackServiceLink: '<',
    createSubnetLink: '<',
    goToVrackOrder: '<',
    storage: '<',
  },
  template,
  controller,
};
