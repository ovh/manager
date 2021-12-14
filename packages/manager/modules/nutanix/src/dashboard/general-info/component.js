import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    cluster: '<',
    goToEditName: '<',
    server: '<',
    serviceDetails: '<',
    serviceInfo: '<',
    serviceName: '<',
    technicalDetails: '<',
    trackingPrefix: '<',
    user: '<',
    handleError: '<',
  },
  controller,
  template,
};
