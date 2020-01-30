import controller from './upgrade.controller';
import template from './upgrade.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    offers: '<',
    user: '<',
  },
  controller,
  template,
};
