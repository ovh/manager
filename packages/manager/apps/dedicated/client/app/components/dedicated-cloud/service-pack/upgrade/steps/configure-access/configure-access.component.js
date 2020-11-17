import controller from './configure-access.controller';
import template from './configure-access.html';

export default {
  bindings: {
    allowedIPsAndBlocks: '<',
    currentService: '<',
    hasDefaultMeansOfPayment: '<',
    pccType: '<',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgradeConfigureAccess',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
