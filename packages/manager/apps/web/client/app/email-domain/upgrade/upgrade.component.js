import controller from './upgrade.controller';
import template from './upgrade.html';

export default {
  bindings: {
    serviceName: '<',
    offers: '<',
    user: '<',
    goToEmailDomain: '<',
  },
  controller,
  template,
};
