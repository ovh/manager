import controller from './resiliation.controller';
import template from './resiliation.html';

export default {
  bindings: {
    availableStrategies: '<',
    displayErrorMessage: '<',
    endStrategies: '<',
    goBack: '<',
    onSuccess: '<',
    service: '<',
    serviceName: '<',
    serviceType: '<',
  },
  controller,
  name: 'ovhManagerBillingResiliation',
  template,
};
