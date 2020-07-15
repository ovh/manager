import controller from './domain-webhosting-order-steps-module.controller';
import template from './domain-webhosting-order-steps-module.html';

export default {
  bindings: {
    getAvailableModules: '&',
    stepperPosition: '@',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderStepsModule',
  require: {
    stepper: '^ovhManagerWebDomainWebhostingOrderSteps',
  },
  template,
};
