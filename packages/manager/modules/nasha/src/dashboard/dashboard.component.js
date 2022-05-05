import controller from './dashboard.controller';
import template from './dashboard.template.html';

export default {
  bindings: {
    alertError: '<',
    goToGeneralInformation: '<',
    nasha: '<',
    reload: '<',
    serviceName: '<',
  },
  controller,
  template,
};
