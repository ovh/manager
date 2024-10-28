import controller from './vrack.controller';
import template from './vrack.html';

export default {
  bindings: {
    features: '<',
    goToMoveDialog: '<',
    deletefeature: '<',
  },
  controller,
  template,
};
