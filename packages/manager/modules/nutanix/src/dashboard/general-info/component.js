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
    trackingPrefix: '<',
    user: '<',
    handleError: '<',
  },
  controller,
  template,
};
