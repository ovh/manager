import controller from './selection.controller';
import template from './selection.html';

export default {
  bindings: {
    activationType: '<',
    currentUser: '<',
    currentService: '<',
    hasDefaultMeansOfPayment: '<',
    header: '@',
    orderableServicePacks: '<',
    servicePacksWithPrices: '<',
    servicePackToOrder: '<?',
    subHeader: '@',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgradeSelection',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
