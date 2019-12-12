import controller from './deskaas-details.controller';
import template from './deskaas-details.html';

const component = {
  bindings: {
    goBackToDetails: '<',
    goToChangePassword: '<',
    goToConsoleAccess: '<',
    goToConfirmTerminate: '<',
  },
  controller,
  template,
};

export default component;
