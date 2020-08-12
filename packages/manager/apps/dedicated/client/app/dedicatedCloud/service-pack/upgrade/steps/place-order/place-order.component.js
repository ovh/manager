import controller from './place-order.controller';
import template from './place-order.html';

export default {
  bindings: {
    activationType: '<',
    currentService: '<',
    hasDefaultMeansOfPayment: '<',
    servicePackToOrder: '<',
    isDowngrade: '<',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgradePlaceOrder',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
