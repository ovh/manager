import controller from './domain-webhosting-order-steps-hosting.controller';
import template from './domain-webhosting-order-steps-hosting.html';

export default {
  bindings: {
    availableOffers: '<',
    user: '<',
    stepperPosition: '@',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderStepsHosting',
  require: {
    stepper: '^ovhManagerWebDomainWebhostingOrderSteps',
  },
  template,
};
