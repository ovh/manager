import controller from './telecom-dashboard-identity-check-form.controller';
import template from './telecom-dashboard-identity-check-form.html';

export default {
  bindings: {
    goToDashboard: '<',
    goToModalCancelProcedure: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
