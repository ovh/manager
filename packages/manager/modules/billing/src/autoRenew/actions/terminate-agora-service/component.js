import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    id: '<',
    serviceType: '<',
  },
  controller,
  template,
  name: 'billingAutorenewTerminateAgoraService',
};
