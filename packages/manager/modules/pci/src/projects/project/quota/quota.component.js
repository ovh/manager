import controller from './quota.controller';
import template from './quota.html';

export default {
  bindings: {
    defaultPaymentMean: '<',
    projectId: '<',
    quotas: '<',
    region: '<',
  },
  controller,
  template,
};
