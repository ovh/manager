import controller from './creditTransfer.controller';
import template from './creditTransfer.html';

export default {
  bindings: {
    goToDashboard: '<',
    serviceName: '<',
    isSmppAccount: '<',
    trackClick: '<',
  },
  controller,
  template,
};
