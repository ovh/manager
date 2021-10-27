import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    server: '<',
    technicalDetails: '<',
    bandwidthInformations: '<',
    specifications: '<',
    cluster: '<',
    serviceInfo: '<',
    serviceDetails: '<',
    user: '<',
    goToEditName: '<',
  },
  controller,
  template,
};
