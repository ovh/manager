import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    bandwidthInformations: '<',
    cluster: '<',
    goToEditName: '<',
    server: '<',
    serviceDetails: '<',
    serviceInfo: '<',
    serviceName: '<',
    specifications: '<',
    technicalDetails: '<',
    trackingPrefix: '<',
    user: '<',
  },
  controller,
  template,
};
