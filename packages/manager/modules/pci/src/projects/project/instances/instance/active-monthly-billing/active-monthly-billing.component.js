import controller from './active-monthly-billing.controller';
import template from './active-monthly-billing.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    goBack: '<',
  },
};
