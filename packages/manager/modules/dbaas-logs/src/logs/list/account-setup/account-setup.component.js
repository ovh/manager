import controller from './account-setup.controller';
import template from './account-setup.html';

export default {
  controller,
  bindings: {
    serviceName: '<',
    service: '<',
    goBack: '<',
    goToDetail: '<',
  },
  template,
};
