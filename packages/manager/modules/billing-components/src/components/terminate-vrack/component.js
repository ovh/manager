import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    service: '<',
    isEmpty: '<',
  },
  controller,
  template,
  name: 'billingTerminateVrack',
};
