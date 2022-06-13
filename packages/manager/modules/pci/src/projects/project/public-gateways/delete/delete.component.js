import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '<',
    gatewayId: '<',
    trackPublicGateways: '<',
    gateway: '<',
  },
  controller,
  template,
};
