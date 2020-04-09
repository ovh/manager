import controller from './order-legacy.controller';
import template from './order-legacy.html';

export default {
  bindings: {
    goBack: '<',
    goToOrganisation: '<',
  },
  controller,
  template,
};
