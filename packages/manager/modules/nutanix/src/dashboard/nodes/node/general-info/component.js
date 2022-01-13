import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    nodeId: '<',
    server: '<',
    user: '<',
    bandwidthInformations: '<',
    specifications: '<',
    technicalDetails: '<',
    goToNodeNameEdit: '<',
    goToNetboot: '<',
    goToNutanixNode: '<',
  },
  controller,
  template,
};
