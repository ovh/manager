import controller from './technical-details.controller';
import template from './technical-details.html';

export default {
  bindings: {
    technicalDetails: '<',
    goToManualUpgrade: '<',
  },
  controller,
  template,
};
