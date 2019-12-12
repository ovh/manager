import controller from './deskaas-confirm-terminate.controller';
import template from './deskaas-confirm-terminate.html';

const component = {
  bindings: {
    goBackToDetails: '<',
    serviceName: '<',
    token: '<',
  },
  controller,
  template,
};

export default component;
