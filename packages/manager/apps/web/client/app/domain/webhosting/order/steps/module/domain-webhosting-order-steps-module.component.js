import controller from './domain-webhosting-order-steps-module.controller';
import template from './domain-webhosting-order-steps-module.html';

export default {
  bindings: {
    availableModules: '<',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderStepsModule',
  require: {
    stepper: '^ovhManagerWebDomainWebhostingOrderSteps',
  },
  template,
};
