import controller from './iplb-update-quota.controller';
import template from './iplb-update-quota.html';

export default {
  bindings: {
    goBack: '<',
    quota: '<',
    serviceName: '<',
  },
  controller,
  template,
};
