import controller from './deskaas-change-password.controller';
import template from './deskaas-change-password.html';

const component = {
  bindings: {
    goBackToDetails: '<',
    serviceName: '<',
    token: '<',
  },
  controller,
  controllerAs: 'vm',
  template,
};

export default component;
