import controller from './edit.controller';
import template from './edit.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '<',
    gateway: '<',
    trackPublicGateways: '<',
    gatewayCatalog: '<',
  },
  controller,
  template,
};
