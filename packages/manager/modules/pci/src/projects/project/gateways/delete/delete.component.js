import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '<',
    id: '<',
    name: '<',
    region: '<',
    trackPublicGateways: '<',
  },
  controller,
  template,
};
