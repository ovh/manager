import controller from './public-gateways.controller';
import template from './public-gateways.html';

export default {
  bindings: {
    publicGateways: '<',
    projectId: '<',
    trackPublicGateways: '<',
  },
  controller,
  template,
};
