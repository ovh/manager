import template from './send-link.html';
import controller from './send-link.controller';

export default {
  template,
  controller,
  bindings: {
    goToSoftphoneDashboard: '<',
    goBack: '<',
    currentUserEmail: '<',
  },
};
