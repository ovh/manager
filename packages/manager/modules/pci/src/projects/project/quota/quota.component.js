import controller from './quota.controller';
import template from './quota.html';

export default {
  bindings: {
    defaultPaymentMean: '<',
    guideUrl: '<',
    projectId: '<',
    quotas: '<',
    region: '<',
  },
  controller,
  template,
};
