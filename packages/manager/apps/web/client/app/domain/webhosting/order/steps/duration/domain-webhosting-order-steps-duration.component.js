import controller from './domain-webhosting-order-steps-duration.controller';
import template from './domain-webhosting-order-steps-duration.html';

export default {
  bindings: {
    user: '<',
    stepperPosition: '@',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderStepsDuration',
  require: {
    stepper: '^ovhManagerWebDomainWebhostingOrderSteps',
  },
  template,
};
