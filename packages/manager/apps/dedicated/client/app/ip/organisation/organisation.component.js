import controller from './organisation.controller';
import template from './organisation.html';

export default {
  bindings: {
    goToAdd: '<',
    goToDashboard: '<',
    goToEdit: '<',
  },
  controller,
  template,
};
