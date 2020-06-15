import template from './inactive.html';
import controller from './inactive.controller';

export default {
  template,
  controller,
  bindings: {
    billingUrl: '<',
    goBack: '<',
    goToBilling: '<',
    goToProject: '<',
    project: '<',
  },
};
