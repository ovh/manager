import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    trackClick: '<',
    trackPage: '<',
    vrackServices: '<',
    availableVracks: '<',
    createVrackServiceLink: '<',
    createSubnetLink: '<',
    storage: '<',
  },
  template,
  controller,
};
