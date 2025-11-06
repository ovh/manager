import controller from './disable.controller';
import template from './disable.html';

export default {
  bindings: {
    goToAutorenew: '<',
    servicesList: '<',
    updateRenew: '<',
  },
  controller,
  template,
};
